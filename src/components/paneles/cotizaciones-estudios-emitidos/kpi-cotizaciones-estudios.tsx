'use client'

import { PanelKpiCard, PanelKpiSkeleton, type KpiAcento } from '@/components/paneles/shared/panel-kpi-card'

export type TarjetaActiva =
	| 'todas'
	| 'vigentes'
	| 'por_vencer'
	| 'vencidas'
	| 'estudios_pendientes'
	| 'estudios_finales_emitidos'

const KPI_LABELS: Record<string, string> = {
	vigentes: 'Cotizaciones vigentes',
	por_vencer: 'Por vencer',
	vencidas: 'Vencidas',
	estudios_pendientes: 'Estudios pendientes',
	estudios_finales_emitidos: 'Estudios finales emitidos',
}

const KPI_ACENTOS: Record<string, KpiAcento> = {
	vigentes: 'success',
	por_vencer: 'warning',
	vencidas: 'danger',
	estudios_pendientes: 'info',
	estudios_finales_emitidos: 'primary',
}

const TARJETAS: TarjetaActiva[] = [
	'vigentes',
	'por_vencer',
	'vencidas',
	'estudios_pendientes',
	'estudios_finales_emitidos',
]

type KpiCotizacionesEstudiosProps = {
	conteos: Record<string, number>
	tarjetaActiva: TarjetaActiva
	onToggleTarjeta: (key: TarjetaActiva) => void
	loading?: boolean
}

export default function KpiCotizacionesEstudios({
	conteos,
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
						value={conteos[key] ?? 0}
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