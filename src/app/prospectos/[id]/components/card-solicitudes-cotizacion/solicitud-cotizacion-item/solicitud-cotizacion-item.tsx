import { PRIORIDAD_BADGE } from '@/app/styles/estados/prioridad-badge'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import { classname } from '@/lib/class-name'
import { formatearFecha } from '@/utils/formatear-fecha'
import { normalizarTexto } from '@/utils/normalizar-texto'
import { useState } from 'react'
import DialogDetalleSolicitud from './dialog-detalle-solicitud/dialog-detalle-solicitud'

type SolicitudCotizacionItemProps = {
	solicitud: SolicitudCotizacion
	informacionCompleta: boolean
}

export default function SolicitudCotizacionItem({
	solicitud,
	informacionCompleta,
}: SolicitudCotizacionItemProps) {
	const [verSolicitud, setVerSolicitud] = useState<boolean>(false)

	return (
		<li
			key={solicitud.id}
			className='flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4'
		>
			<div className='min-w-0 flex-1'>
				<p className='truncate text-sm font-semibold text-foreground'>
					{solicitud.producto}
				</p>
				<div className='mt-1 flex flex-wrap items-center gap-1.5'>
					<Badge
						variant='outline'
						className={classname(
							'text-[10px] font-medium capitalize',
							PRIORIDAD_BADGE[solicitud.prioridad],
						)}
					>
						{normalizarTexto(solicitud.prioridad, true)}
					</Badge>
					{!solicitud.informacion_completa && (
						<Badge
							variant='outline'
							className='text-[10px] font-medium capitalize border-sky-500/35 bg-sky-500/10 text-sky-950 dark:text-sky-100'
						>
							Información incompleta
						</Badge>
					)}
					<EstadoCompletitudInformacion
						completa={informacionCompleta}
						className='text-[10px] font-medium capitalize'
					/>
				</div>
				<p className='mt-0.5 text-xs text-muted-foreground'>
					Solicitud ·{' '}
					{formatearFecha(new Date(solicitud.fecha), 'dd-MM-yyyy · HH:mm')}
				</p>
				{solicitud.observaciones?.trim() ? (
					<p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>
						{solicitud.observaciones.trim()}
					</p>
				) : null}
			</div>

			<div className='flex shrink-0 justify-end'>
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-8 text-xs shadow-none'
					onClick={() => setVerSolicitud(true)}
				>
					Ver solicitud
				</Button>
			</div>

			<DialogDetalleSolicitud
				solicitud={solicitud}
				open={verSolicitud}
				onOpenChange={setVerSolicitud}
			/>
		</li>
	)
}
