import { HistorialEstadoJson } from '@/aplicacion/estados/dto/historial-estado-json'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { Badge } from '@/components/badge'

import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'
import { formatearFecha } from '@/utils/formatear-fecha'

type HistorialEstadoComercialListaProps = {
	historial: HistorialEstadoJson[]
}

export function HistorialEstadoComercialLista({
	historial,
}: HistorialEstadoComercialListaProps) {
	if (historial.length === 0) {
		return (
			<p className='text-xs text-muted-foreground'>
				Sin cambios registrados aún.
			</p>
		)
	}

	return (
		<ul className='max-item-[min(60vh,420px)] space-y-3 overflow-y-auto pr-1'>
			{historial.map((item, index) => (
				<li
					key={index}
					className='rounded-md border border-border bg-muted/15 px-3 py-2 text-xs'
				>
					<div className='flex flex-wrap items-center gap-2'>
						{item.estado_anterior ? (
							<Badge variant='outline' className='text-xs font-normal'>
								{ESTADO_PROSPECTO_LABELS[item.estado_anterior]}
							</Badge>
						) : (
							<span className='text-muted-foreground'>—</span>
						)}
						<span className='text-muted-foreground'>→</span>
					<Badge
						variant={ESTADO_COMERCIAL_BADGE[item.estado_actual]}
						className='text-xs font-medium'
					>
							{ESTADO_PROSPECTO_LABELS[item.estado_actual]}
						</Badge>
						<span className='text-xs text-muted-foreground'>
							{item.motivo_cambio}
						</span>
					</div>
					<p className='mt-1 tabular-nums text-muted-foreground'>
						{formatearFecha(
							new Date(item.fecha_registro),
							'd MMM yyyy · HH:mm',
						)}{' '}
						· {item.cambiado_por}
					</p>
					<p className='mt-1 font-medium text-foreground'>
						{ESTADO_PROSPECTO_LABELS[item.estado_actual]}
					</p>
				</li>
			))}
		</ul>
	)
}
