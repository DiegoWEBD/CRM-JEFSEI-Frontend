import { PRIORIDAD_BADGE } from '@/app/styles/estados/prioridad-badge'
import { Badge } from '@/components/badge/badge'
import Button from '@/components/button/button'
import Card from '@/components/card/card'
import CardContent from '@/components/card/card-content/card-content'
import CardHeader from '@/components/card/card-header/card-header'
import CardTitle from '@/components/card/card-title/card-title'
import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { useObtenerSolicitudesCotizacion } from '@/hooks/solicitudes-cotizacion/use-obtener-solicitudes-cotizacion'
import { classname } from '@/lib/class-name'
import { formatearFecha } from '@/utils/formatear-fecha'
import { normalizarTexto } from '@/utils/normalizar-texto'
import { Plus } from 'lucide-react'
import { useState } from 'react'

type CardSolicitudesCotizacionProps = {
	idProspecto: number
	informacionCompleta: boolean
}

export default function CardSolicitudesCotizacion({
	informacionCompleta,
	idProspecto,
}: CardSolicitudesCotizacionProps) {
	const { data: solicitudes } = useObtenerSolicitudesCotizacion(idProspecto)

	const [openDialogNuevaSolicitud, setOpenDialogNuevaSolicitud] =
		useState<boolean>(false)

	const botonNueva = (
		<Button
			type='button'
			size='sm'
			className='h-8 shrink-0 gap-1 text-xs shadow-none'
			onClick={() => setOpenDialogNuevaSolicitud(true)}
		>
			<Plus className='h-3.5 w-3.5' aria-hidden />
			Nueva solicitud de cotización
		</Button>
	)

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle className='min-w-0 text-sm font-semibold leading-tight tracking-tight text-foreground'>
					Solicitudes de cotización por línea de seguro
				</CardTitle>
				<AuthGuard codigosRoles={['EJECUTIVO_COMERCIAL']}>
					{solicitudes && solicitudes.length > 0 ? botonNueva : null}
				</AuthGuard>
			</CardHeader>

			<CardContent className='p-0'>
				{solicitudes?.length === 0 && (
					<div className='flex flex-col items-center gap-3 px-4 py-8 text-center'>
						<p className='max-w-md text-sm text-muted-foreground'>
							Aún no hay solicitudes de cotización registradas para este
							cliente.
						</p>
						<AuthGuard codigosRoles={['EJECUTIVO_COMERCIAL']}>
							{botonNueva}
						</AuthGuard>
					</div>
				)}
				<ul className='divide-y divide-border'>
					{solicitudes?.map(solicitud => (
						<li
							key={solicitud.id}
							className='flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4'
						>
							<div className='min-w-0 flex-1'>
								<p className='truncate text-sm font-semibold text-foreground'>
									Espacios comunes
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
									{!solicitud.revisado && (
										<Badge
											variant='outline'
											className='text-[10px] font-medium capitalize border-sky-500/35 bg-sky-500/10 text-sky-950 dark:text-sky-100'
										>
											Pendiente de revisión
										</Badge>
									)}
									<EstadoCompletitudInformacion
										completa={informacionCompleta}
										className='text-[10px] font-medium capitalize'
									/>
								</div>
								<p className='mt-0.5 text-xs text-muted-foreground'>
									Solicitud ·{' '}
									{formatearFecha(
										new Date(solicitud.fecha),
										'dd-MM-yyyy · HH:mm',
									)}
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
								>
									Ver solicitud
								</Button>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	)
}
