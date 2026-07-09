'use client'

import { useCallback, useMemo, useState } from 'react'
import { ColumnaCobranza, CuotaDashboard, DashboardCobranza, PolizaSinPlanPago } from '@/dominio/cobranza/dashboard-cobranza'
import { useDashboardCobranza } from '@/hooks/cobranza/use-dashboard-cobranza'
import KpiCobranza from './kpi-cobranza'
import KanbanCobranza from './kanban-cobranza'
import DialogDetalleKpi from './dialog-detalle-kpi'
import DialogRegistrarPago from './dialog-registrar-pago'

type PanelCobranzaClientProps = {
	dashboardInicial?: DashboardCobranza
}

function obtenerItems(columna: ColumnaCobranza, dashboard: DashboardCobranza): (CuotaDashboard | PolizaSinPlanPago)[] {
	switch (columna) {
		case 'pagados': return dashboard.pagados
		case 'morosos': return dashboard.morosos
		case 'atrasados': return dashboard.atrasados
		case 'sinPlanPago': return dashboard.sin_plan_pago
		case 'llamarHoy': return dashboard.llamar_hoy
		case 'proximos10': return dashboard.proximos10
	}
}

export default function PanelCobranzaClient({ dashboardInicial }: PanelCobranzaClientProps) {
	const { data: dashboard, isLoading } = useDashboardCobranza(dashboardInicial)

	const [columnaKpiAbierta, setColumnaKpiAbierta] = useState<ColumnaCobranza | null>(null)
	const [cuotaPago, setCuotaPago] = useState<CuotaDashboard | null>(null)

	const handleRegistrarPago = useCallback((cuota: CuotaDashboard) => {
		setCuotaPago(cuota)
	}, [])

	const itemsKpiAbiertos = useMemo(() => {
		if (!dashboard || !columnaKpiAbierta) return []
		return obtenerItems(columnaKpiAbierta, dashboard)
	}, [dashboard, columnaKpiAbierta])

	if (isLoading && !dashboardInicial) {
		return <CobranzaSkeleton />
	}

	if (!dashboard) return null

	return (
		<div className='space-y-6'>
			<KpiCobranza
				kpis={dashboard.kpis}
				onKpiClick={columna => setColumnaKpiAbierta(columna)}
			/>

			<KanbanCobranza
				dashboard={dashboard}
				onRegistrarPago={handleRegistrarPago}
			/>

			<DialogDetalleKpi
				open={columnaKpiAbierta != null}
				onOpenChange={open => {
					if (!open) setColumnaKpiAbierta(null)
				}}
				columna={columnaKpiAbierta}
				items={itemsKpiAbiertos}
			/>

			<DialogRegistrarPago
				open={cuotaPago != null}
				onOpenChange={open => {
					if (!open) setCuotaPago(null)
				}}
				cuota={cuotaPago}
			/>
		</div>
	)
}

function CobranzaSkeleton() {
	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className='h-28 animate-pulse rounded-xl border border-border/60 bg-card'
					/>
				))}
			</div>
			<div className='flex gap-3 overflow-x-auto' style={{ minWidth: '640px' }}>
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className='h-80 w-64 shrink-0 animate-pulse rounded-lg border border-border/60 bg-card/50'
					/>
				))}
			</div>
		</div>
	)
}
