'use client'

import {
	PanelKpiCard,
	PanelKpiSkeleton,
	type KpiAcento,
} from '@/components/paneles/shared/panel-kpi-card'

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

const TARJETAS: TarjetaActiva[] = [
	'todas',
	'abiertos',
	'ganados',
	'perdidos',
	'verde',
	'amarillo',
	'rojo',
]

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
		return <PanelKpiSkeleton count={TARJETAS.length} />
	}

	return (
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7'>
			{TARJETAS.map(key => (
				<PanelKpiCard
					key={key}
					label={KPI_LABELS[key]}
					value={conteos[key] ?? 0}
					accent={KPI_ACENTOS[key]}
					activa={tarjetaActiva === key}
					onClick={() => onToggleTarjeta(tarjetaActiva === key ? 'todas' : key)}
				/>
			))}
		</div>
	)
}
