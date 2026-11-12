'use client'

import { PanelKpiCard, PanelKpiSkeleton, type KpiAcento } from '@/components/paneles/shared/panel-kpi-card'
import type { ContadoresPanelCotizaciones } from '@/aplicacion/cotizaciones-estudios/dto/obtener-panel-estudios-response'

export type TarjetaActiva =
	| 'todas'
	| 'cotizaciones_vigentes'
	| 'cotizaciones_por_vencer'
	| 'cotizaciones_vencidas'
	| 'estudios_pendientes'
	| 'estudios_emitidos'

type TarjetaKey = Exclude<TarjetaActiva, 'todas'>

const KPI_LABELS: Record<TarjetaKey, string> = {
	cotizaciones_vigentes: 'Cotizaciones vigentes',
	cotizaciones_por_vencer: 'Por vencer',
	cotizaciones_vencidas: 'Vencidas',
	estudios_pendientes: 'Estudios pendientes',
	estudios_emitidos: 'Estudios finales emitidos',
}

const KPI_ACENTOS: Record<TarjetaKey, KpiAcento> = {
	cotizaciones_vigentes: 'success',
	cotizaciones_por_vencer: 'warning',
	cotizaciones_vencidas: 'danger',
	estudios_pendientes: 'info',
	estudios_emitidos: 'primary',
}

const TARJETAS: TarjetaKey[] = [
	'cotizaciones_vigentes',
	'cotizaciones_por_vencer',
	'cotizaciones_vencidas',
	'estudios_pendientes',
	'estudios_emitidos',
]

type KpiCotizacionesEstudiosProps = {
	/** Contadores globales que entrega el backend, previos a cualquier filtro. */
	contadores: ContadoresPanelCotizaciones
	tarjetaActiva: TarjetaActiva
	onToggleTarjeta: (key: TarjetaActiva) => void
	loading?: boolean
}

export default function KpiCotizacionesEstudios({
	contadores,
	tarjetaActiva,
	onToggleTarjeta,
	loading,
}: KpiCotizacionesEstudiosProps) {
	if (loading) {
		return <PanelKpiSkeleton count={TARJETAS.length} />
	}

	return (
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
			{TARJETAS.map(key => {
				const acento = KPI_ACENTOS[key] as KpiAcento
				return (
					<PanelKpiCard
						key={key}
						label={KPI_LABELS[key]}
						value={contadores[key] ?? 0}
						accent={acento}
						activa={tarjetaActiva === key}
						onClick={() =>
							onToggleTarjeta(tarjetaActiva === key ? 'todas' : key)
						}
					/>
				)
			})}
		</div>
	)
}
