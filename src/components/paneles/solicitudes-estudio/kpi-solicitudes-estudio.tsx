'use client'

import { FileWarning, ClipboardList, ClipboardCheck, FileCheck, type LucideIcon } from 'lucide-react'
import { PanelKpiCard, type KpiAcento } from '@/components/paneles/shared/panel-kpi-card'
import type { ContadoresSolicitudesCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-todas-solicitudes-cotizacion/dto/obtener-todas-solicitudes-cotizacion-response'

export type TarjetaActiva =
	| 'todas'
	| 'informacion_incompleta'
	| 'listas_para_cotizar'
	| 'cotizaciones_emitidas'
	| 'estudios_emitidos'

type TarjetaConfig = {
	key: Exclude<TarjetaActiva, 'todas'>
	label: string
	icon: LucideIcon
	accent: KpiAcento
}

const TARJETAS: TarjetaConfig[] = [
	{ key: 'informacion_incompleta', label: 'Información incompleta', icon: FileWarning, accent: 'warning' },
	{ key: 'listas_para_cotizar', label: 'Listas para cotizar', icon: ClipboardList, accent: 'info' },
	{ key: 'cotizaciones_emitidas', label: 'Cotizaciones emitidas', icon: ClipboardCheck, accent: 'success' },
	{ key: 'estudios_emitidos', label: 'Estudios emitidos', icon: FileCheck, accent: 'primary' },
]

type KpiSolicitudesEstudioProps = {
	contadores: ContadoresSolicitudesCotizacion
	tarjetaActiva: TarjetaActiva
	onToggleTarjeta: (key: TarjetaActiva) => void
}

export default function KpiSolicitudesEstudio({
	contadores,
	tarjetaActiva,
	onToggleTarjeta,
}: KpiSolicitudesEstudioProps) {
	return (
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
			{TARJETAS.map(t => (
				<PanelKpiCard
					key={t.key}
					label={t.label}
					value={contadores[t.key]}
					icon={t.icon}
					accent={t.accent}
					activa={tarjetaActiva === t.key}
					onClick={() =>
						onToggleTarjeta(tarjetaActiva === t.key ? 'todas' : t.key)
					}
				/>
			))}
		</div>
	)
}
