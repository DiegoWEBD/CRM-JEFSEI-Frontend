'use client'

import { useState } from 'react'

import PanelLayout from '@/components/paneles/panel-layout/panel-layout'

import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { DashboardSkeleton } from '@/components/paneles/dashboard/panel-dashboard-skeleton'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { useMetricasDashboardGerente } from '@/hooks/dashboard-gerente/use-metricas-dashboard-gerente'
import CommercialActivitiesSection from './contents/actividades-comerciales/commercial-activities-section'
import ProductionSection from './contents/produccion/production-section'
import PoliciesReportsSection from './contents/reportes-polizas/policies-reports-section'

const MESES = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
]

export default function PanelDashboardClient() {
	const hoy = new Date()
	const [mes, setMes] = useState<number>(hoy.getMonth() + 1)
	const [year, setYear] = useState<number>(hoy.getFullYear())

	const {
		data: metricas,
		isLoading,
		error,
	} = useMetricasDashboardGerente(mes, year)

	/*const {
		data: kpis,
		isLoading: isLoadingKpis,
	} = useKpisComerciales(mes, year)*/

	const rangoYears = Array.from(
		{ length: 5 },
		(_, i) => hoy.getFullYear() - 2 + i,
	)

	if (isLoading) {
		return <DashboardSkeleton />
	}

	if (error || !metricas) {
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					Error al cargar métricas del dashboard.
				</p>
			</div>
		)
	}

	return (
		<PermissionGuard allowedPermissions={['VER_METRICAS_GERENCIA']}>
			<PanelLayout>
				<div className='flex items-center gap-3'>
					<Select value={String(mes)} onValueChange={v => setMes(Number(v))}>
						<SelectTrigger className='w-35 h-8 text-xs'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MESES.map((nombre, i) => (
								<SelectItem
									key={i + 1}
									value={String(i + 1)}
									className='text-xs'
								>
									{nombre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={String(year)} onValueChange={v => setYear(Number(v))}>
						<SelectTrigger className='w-25 h-8 text-xs'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{rangoYears.map(y => (
								<SelectItem key={y} value={String(y)} className='text-xs'>
									{y}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<ProductionSection data={metricas.produccion} />
				<CommercialActivitiesSection data={metricas.actividades_comerciales} />
				<PoliciesReportsSection data={metricas.reportes_polizas} />

				{/*kpis && (
					<>
						<div className='border-t border-border/60 pt-6'>
							<ConversionSection
								data={kpis.conversion_prospectos}
								cierre={kpis.cierre_oportunidades}
							/>
						</div>

						<ProduccionVsMetaSection data={kpis.prima_vs_meta} />

						<PipelineSection
							tiempoCierre={kpis.tiempo_promedio_cierre}
							aging={kpis.aging_pipeline}
						/>

						<RetencionSection
							renovacion={kpis.renovacion}
							primaRiesgo={kpis.prima_en_riesgo}
						/>

						<CobranzaKpiSection data={kpis.morosidad} />
					</>
				)*/}

				{/*isLoadingKpis && !kpis && (
					<div className='space-y-4'>
						<div className='h-6 w-28 animate-pulse rounded bg-muted' />
						<div className='grid gap-2.5 lg:grid-cols-2'>
							<div className='h-24 animate-pulse rounded-lg bg-muted' />
							<div className='h-24 animate-pulse rounded-lg bg-muted' />
						</div>
					</div>
				)*/}
			</PanelLayout>
		</PermissionGuard>
	)
}
