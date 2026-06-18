import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { useObtenerSolicitudesCotizacion } from '@/hooks/solicitudes-cotizacion/use-obtener-solicitudes-cotizacion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import SolicitudCotizacionItem from './solicitud-cotizacion-item/solicitud-cotizacion-item'

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
				<AuthGuard allowedRoles={['EJECUTIVO_COMERCIAL']}>
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
						<AuthGuard allowedRoles={['EJECUTIVO_COMERCIAL']}>
							{botonNueva}
						</AuthGuard>
					</div>
				)}
				<ul className='divide-y divide-border'>
					{solicitudes?.map(solicitud => (
						<SolicitudCotizacionItem
							key={solicitud.id}
							solicitud={solicitud}
							informacionCompleta={informacionCompleta}
						/>
					))}
				</ul>
			</CardContent>
		</Card>
	)
}
