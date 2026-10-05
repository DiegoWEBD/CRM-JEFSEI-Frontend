'use client'

import { ClipboardList, ExternalLink } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/button'
import BadgeEstadoSolicitud, {
	EstadoSolicitudBandeja,
} from '@/components/paneles/solicitudes-estudio/badge-estado-solicitud'
import { Skeleton } from '@/components/skeleton'
import { useObtenerTodasSolicitudesCotizacion } from '@/hooks/solicitudes-cotizacion/use-obtener-todas-solicitudes-cotizacion'
import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import { formatearFecha } from '@/utils/formatear-fecha'
import HomeSeccion from '../home-seccion/home-seccion'

function resolverEstado(s: SolicitudCotizacionResumen): EstadoSolicitudBandeja {
	if (!s.informacion_completa) return 'informacion_incompleta'
	if (s.estudio_disponible) return 'estudio_emitido'
	if (s.cantidad_cotizaciones > 0) return 'con_cotizaciones'
	return 'lista_para_cotizar'
}

const MAX_VISIBLE = 5

export default function HomeSolicitudesRecientes() {
	const { data: solicitudes, isLoading } = useObtenerTodasSolicitudesCotizacion()

	const total = solicitudes?.length ?? 0
	const visibles = solicitudes?.slice(0, MAX_VISIBLE) ?? []

	return (
		<HomeSeccion
			icono={ClipboardList}
			titulo='Solicitudes de estudio'
			contador={total > 0 ? total : undefined}
			accion={
				<Button asChild variant='ghost' size='sm' className='h-7 gap-1 text-xs'>
					<Link href='/solicitudes-estudio'>
						Ver todas
						<ExternalLink className='h-3 w-3' aria-hidden />
					</Link>
				</Button>
			}
		>
			{isLoading ? (
				<div className='space-y-2'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className='flex items-center gap-3'>
							<Skeleton className='h-4 flex-1' />
							<Skeleton className='h-5 w-24 rounded-full' />
						</div>
					))}
				</div>
			) : total === 0 ? (
				<p className='py-4 text-center text-xs text-muted-foreground'>
					Sin solicitudes pendientes.
				</p>
			) : (
				<div className='space-y-1.5'>
					{visibles.map(s => (
						<div
							key={s.id}
							className='flex items-center gap-3 rounded-md border border-border/60 px-2.5 py-2 text-xs'
						>
							<div className='min-w-0 flex-1'>
								<p className='truncate font-medium text-foreground'>
									{s.nombre_riesgo}
								</p>
								<p className='text-[11px] text-muted-foreground'>
									{s.producto} · {formatearFecha(new Date(s.fecha), 'dd/MM/yyyy')}
								</p>
							</div>
							<BadgeEstadoSolicitud estado={resolverEstado(s)} />
						</div>
					))}
					{total > MAX_VISIBLE && (
						<p className='pt-1 text-center text-[11px] text-muted-foreground'>
							+{total - MAX_VISIBLE} más
						</p>
					)}
				</div>
			)}
		</HomeSeccion>
	)
}
