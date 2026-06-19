import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import DialogNuevaSolicitudCotizacion from '@/components/solicitud-cotizacion/dialog-nueva-solicitud-cotizacion'
import { useObtenerSolicitudesCotizacion } from '@/hooks/solicitudes-cotizacion/use-obtener-solicitudes-cotizacion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import SolicitudCotizacionItem from './solicitud-cotizacion-item/solicitud-cotizacion-item'

type CardSolicitudesCotizacionProps = {
	idProspecto: number
	informacionCompleta: boolean
	nombreCliente: string
	lineaNegocioNombre: string
}

export default function CardSolicitudesCotizacion({
	informacionCompleta,
	idProspecto,
	nombreCliente,
	lineaNegocioNombre,
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
		<>
			<Card className='border-border bg-card shadow-none'>
				<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
					<CardTitle className='min-w-0 text-sm font-semibold leading-tight tracking-tight text-foreground'>
						Solicitudes del cliente
					</CardTitle>
					<AuthGuard allowedRoles={['EJECUTIVO_COMERCIAL']}>
						{solicitudes && solicitudes.length > 0 ? botonNueva : null}
					</AuthGuard>
				</CardHeader>

				<CardContent className='p-3 sm:p-4'>
					{solicitudes?.length === 0 && (
						<div className='flex flex-col items-center gap-3 px-4 py-8 text-center'>
							<p className='max-w-md text-sm text-muted-foreground'>
								Aún no hay solicitudes de cotización registradas para este
								cliente.
							</p>
							<AuthGuard allowedRoles={['EJECUTIVO_COMERCIAL']}>
								{botonNueva}
							</AuthGuard>
						</div>
					)}
					<ul className='space-y-2'>
						{solicitudes?.map(solicitud => (
							<SolicitudCotizacionItem
								key={solicitud.id}
								solicitud={solicitud}
								informacionCompleta={informacionCompleta}
								idProspecto={idProspecto}
								nombreCliente={nombreCliente}
								lineaNegocioNombre={lineaNegocioNombre}
							/>
						))}
					</ul>
				</CardContent>
			</Card>

			<DialogNuevaSolicitudCotizacion
				open={openDialogNuevaSolicitud}
				onOpenChange={setOpenDialogNuevaSolicitud}
				idProspecto={idProspecto}
				nombreCliente={nombreCliente}
				lineaNegocioNombre={lineaNegocioNombre}
			/>
		</>
	)
}
