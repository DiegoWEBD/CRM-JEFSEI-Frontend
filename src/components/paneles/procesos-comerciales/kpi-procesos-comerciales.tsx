'use client'

import {
	PanelKpiCard,
	PanelKpiSkeleton,
	type KpiAcento,
} from '@/components/paneles/shared/panel-kpi-card'
import type { LucideIcon } from 'lucide-react'
import {
	AlertCircle,
	AlertTriangle,
	BarChart3,
	CheckCircle,
	Clock,
	FolderOpen,
	XCircle,
} from 'lucide-react'

export type TarjetaActiva =
	| 'todas'
	| 'abiertos'
	| 'ganados'
	| 'perdidos'
	| 'verde'
	| 'amarillo'
	| 'rojo'

export type ConteosProcesos = Record<TarjetaActiva, number>

const KPI_LABELS: Record<TarjetaActiva, string> = {
	todas: 'Total oportunidades',
	abiertos: 'Abiertos',
	ganados: 'Ganados',
	perdidos: 'Perdidos',
	verde: 'En plazo',
	amarillo: 'En riesgo',
	rojo: 'Atrasados',
}

const KPI_ACENTOS: Record<TarjetaActiva, KpiAcento> = {
	todas: null,
	abiertos: null,
	ganados: null,
	perdidos: null,
	verde: 'success',
	amarillo: 'warning',
	rojo: 'danger',
}

const KPI_ICONOS: Record<TarjetaActiva, LucideIcon> = {
	todas: BarChart3,
	abiertos: FolderOpen,
	ganados: CheckCircle,
	perdidos: XCircle,
	verde: Clock,
	amarillo: AlertTriangle,
	rojo: AlertCircle,
}

const TARJETAS_FILA_1: TarjetaActiva[] = [
	'todas',
	'abiertos',
	'ganados',
	'perdidos',
]
const TARJETAS_FILA_2: TarjetaActiva[] = ['verde', 'amarillo', 'rojo']

type KpiProcesosComercialesProps = {
	conteos: ConteosProcesos
	tarjetaActiva: TarjetaActiva
	onToggleTarjeta: (key: TarjetaActiva) => void
	loading?: boolean
}

export default function KpiProcesosComerciales({
	conteos,
	tarjetaActiva,
	onToggleTarjeta,
	loading,
}: KpiProcesosComercialesProps) {
	if (loading) {
		return (
			<div className='space-y-3'>
				<PanelKpiSkeleton count={4} />
				<PanelKpiSkeleton count={3} />
			</div>
		)
	}

	const totalAbiertos = conteos.abiertos || 1

	const calcularPorcentaje = (valor: number) =>
		`${((valor / totalAbiertos) * 100).toFixed(0)}% del total`

	return (
		<div className='space-y-3'>
			<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
				{TARJETAS_FILA_1.map(key => (
					<PanelKpiCard
						key={key}
						label={KPI_LABELS[key]}
						value={conteos[key] ?? 0}
						icon={KPI_ICONOS[key]}
						accent={KPI_ACENTOS[key]}
						activa={tarjetaActiva === key}
						onClick={() =>
							onToggleTarjeta(tarjetaActiva === key ? 'todas' : key)
						}
					/>
				))}
			</div>
			<div className='grid grid-cols-3 gap-3'>
				{TARJETAS_FILA_2.map(key => (
					<PanelKpiCard
						key={key}
						label={KPI_LABELS[key]}
						value={conteos[key] ?? 0}
						subtitle={calcularPorcentaje(conteos[key] ?? 0)}
						icon={KPI_ICONOS[key]}
						accent={KPI_ACENTOS[key]}
						activa={tarjetaActiva === key}
						onClick={() =>
							onToggleTarjeta(tarjetaActiva === key ? 'todas' : key)
						}
					/>
				))}
			</div>
		</div>
	)
}
