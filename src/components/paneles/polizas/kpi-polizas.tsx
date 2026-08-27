'use client'

import { PanelKpiCard } from '@/components/paneles/shared/panel-kpi-card/panel-kpi-card'
import { PanelKpiSkeleton } from '@/components/paneles/shared/panel-kpi-card/panel-kpi-card'
import type { KpisPoliza } from '@/aplicacion/polizas/use_cases/dto/obtener_polizas_response'
import {
	FileText,
	CheckCircle,
	AlertTriangle,
	XCircle,
	Ban,
	Clock,
	DollarSign,
	TrendingUp,
	Percent,
} from 'lucide-react'
import { formatUF } from '@/lib/uf'

export type FiltroEstadoPoliza =
	| 'todas'
	| 'vigentes'
	| 'por_vencer'
	| 'vencidas'
	| 'canceladas'
	| 'registradas'

type KpiPolizasProps = {
	kpis: KpisPoliza | undefined
	loading: boolean
	filtroEstado: FiltroEstadoPoliza
	onFiltroEstadoChange: (filtro: FiltroEstadoPoliza) => void
}

const KPI_LABELS: Record<FiltroEstadoPoliza, string> = {
	todas: 'Total pólizas',
	vigentes: 'Vigentes',
	por_vencer: 'Por vencer',
	vencidas: 'Vencidas',
	canceladas: 'Canceladas',
	registradas: 'Registradas',
}

const KPI_ICONOS: Record<FiltroEstadoPoliza, typeof FileText> = {
	todas: FileText,
	vigentes: CheckCircle,
	por_vencer: AlertTriangle,
	vencidas: XCircle,
	canceladas: Ban,
	registradas: Clock,
}

const KPI_ACENTOS: Record<
	FiltroEstadoPoliza,
	'info' | 'success' | 'warning' | 'danger' | 'primary'
> = {
	todas: 'info',
	vigentes: 'success',
	por_vencer: 'warning',
	vencidas: 'danger',
	canceladas: 'info',
	registradas: 'primary',
}

const TARJETAS_ESTADO: FiltroEstadoPoliza[] = [
	'todas',
	'vigentes',
	'por_vencer',
	'vencidas',
	'canceladas',
	'registradas',
]

export function KpiPolizas({
	kpis,
	loading,
	filtroEstado,
	onFiltroEstadoChange,
}: KpiPolizasProps) {
	if (loading || !kpis) {
		return <PanelKpiSkeleton count={5} />
	}

	const obtenerValor = (key: FiltroEstadoPoliza): number => {
		switch (key) {
			case 'todas':
				return kpis.total_polizas
			case 'vigentes':
				return kpis.vigentes
			case 'por_vencer':
				return kpis.por_vencer
			case 'vencidas':
				return kpis.vencidas
			case 'canceladas':
				return kpis.canceladas
			case 'registradas':
				return kpis.registradas
		}
	}

	return (
		<div className='space-y-3'>
			<div
				className='grid grid-cols-2 gap-3 sm:grid-cols-3'
				style={{
					gridTemplateColumns: `repeat(min(${TARJETAS_ESTADO.length}, 6), minmax(0, 1fr))`,
				}}
			>
				{TARJETAS_ESTADO.map(key => (
					<PanelKpiCard
						key={key}
						label={KPI_LABELS[key]}
						value={obtenerValor(key)}
						icon={KPI_ICONOS[key]}
						accent={KPI_ACENTOS[key]}
						activa={filtroEstado === key}
						onClick={() =>
							onFiltroEstadoChange(filtroEstado === key ? 'todas' : key)
						}
					/>
				))}
			</div>

			<div className='grid grid-cols-3 gap-3'>
				<PanelKpiCard
					label='Prima neta total'
					value={formatUF(kpis.prima_neta_total)}
					icon={DollarSign}
					accent='primary'
				/>
				<PanelKpiCard
					label='Prima vigente'
					value={formatUF(kpis.prima_vigente)}
					icon={TrendingUp}
					accent='success'
				/>
				<PanelKpiCard
					label='Comisión total'
					value={formatUF(kpis.comision_total)}
					icon={Percent}
					accent='primary'
				/>
			</div>
		</div>
	)
}
