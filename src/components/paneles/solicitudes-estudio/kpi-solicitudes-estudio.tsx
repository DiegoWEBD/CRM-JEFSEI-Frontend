'use client'

import { FileWarning, ClipboardList, ClipboardCheck, FileCheck, type LucideIcon } from 'lucide-react'
import { PanelKpiCard, type KpiAcento } from '@/components/paneles/shared/panel-kpi-card'

export type TarjetaActiva = 'todas' | 'informacion_incompleta' | 'lista_para_cotizar' | 'con_cotizaciones' | 'estudio_emitido'

type TarjetaConfig = {
	key: Exclude<TarjetaActiva, 'todas'>
	label: string
	icon: LucideIcon
	accent: KpiAcento
}

const TARJETAS: TarjetaConfig[] = [
	{ key: 'informacion_incompleta', label: 'Información incompleta', icon: FileWarning, accent: 'warning' },
	{ key: 'lista_para_cotizar', label: 'Listas para cotizar', icon: ClipboardList, accent: 'info' },
	{ key: 'con_cotizaciones', label: 'Cotizaciones emitidas', icon: ClipboardCheck, accent: 'success' },
	{ key: 'estudio_emitido', label: 'Estudios emitidos', icon: FileCheck, accent: 'primary' },
]

type KpiSolicitudesEstudioProps = {
	conteos: Record<string, number>
	tarjetaActiva: TarjetaActiva
	onToggleTarjeta: (key: TarjetaActiva) => void
}

export default function KpiSolicitudesEstudio({
	conteos,
	tarjetaActiva,
	onToggleTarjeta,
}: KpiSolicitudesEstudioProps) {
	return (
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
			{TARJETAS.map(t => (
				<PanelKpiCard
					key={t.key}
					label={t.label}
					value={conteos[t.key] ?? 0}
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