'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/sheet'
import { Separator } from '@/components/separator'
import { ScrollArea } from '@/components/scroll-area/scroll-area'
import { formatFechaCorta } from '@/utils/format-fecha-corta'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Skeleton } from '@/components/skeleton'
import BadgePrioridad from '@/components/badge-prioridad/badge-prioridad'
import BadgeEstadoSolicitud from './badge-estado-solicitud'
import { labelCampo } from '@/lib/etiquetas-campos-prospecto'
import { TIPO_LINEA_LABELS } from '@/lib/solicitud-cotizacion-catalogo'
import { CircleAlert } from 'lucide-react'

function FilaDetalle({
	label,
	children,
}: {
	label: string
	children: React.ReactNode
}) {
	return (
		<div className='space-y-0.5'>
			<p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
				{label}
			</p>
			<div className='text-sm text-foreground'>{children}</div>
		</div>
	)
}

function DetallesSkeleton() {
	return (
		<div className='space-y-3'>
			<Skeleton className='h-4 w-32' />
			<Skeleton className='h-4 w-48' />
			<Skeleton className='h-4 w-40' />
		</div>
	)
}

function resolverEstado(s: SolicitudCotizacionResumen) {
	if (!s.informacion_completa) return 'informacion_incompleta' as const
	if (s.cantidad_cotizaciones > 0) return 'con_cotizaciones' as const
	return 'lista_para_cotizar' as const
}

type SheetDetalleSolicitudProps = {
	solicitud: SolicitudCotizacionResumen | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function SheetDetalleSolicitud({
	solicitud,
	open,
	onOpenChange,
}: SheetDetalleSolicitudProps) {
	const { data: solicitudCompleta, isLoading: cargandoDetalle } = useQuery({
		queryKey: ['solicitud-detalle', solicitud?.id],
		queryFn: async () => {
			const res = await axios.get(
				`/api/solicitudes-cotizacion/${solicitud!.id}`,
			)
			return res.data as SolicitudCotizacion
		},
		enabled: !!solicitud,
	})

	if (!solicitud) return null

	const estado = resolverEstado(solicitud)
	const full = solicitudCompleta

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
				<SheetHeader className='border-b border-border px-4 py-3 text-left'>
					<SheetTitle className='text-base leading-snug'>
						{solicitud.nombre_riesgo}
					</SheetTitle>
					<p className='text-xs text-muted-foreground'>
						{full?.producto || solicitud.producto}
					</p>
					<div className='mt-2'>
						<BadgeEstadoSolicitud estado={estado} />
					</div>
				</SheetHeader>

				<ScrollArea className='flex-1 overflow-y-auto px-4 py-3'>
					<div className='space-y-4 pr-2'>
						<FilaDetalle label='Producto'>
							{TIPO_LINEA_LABELS[full?.tipo ?? solicitud.tipo] ||
								full?.tipo ||
								solicitud.tipo}
						</FilaDetalle>

						{cargandoDetalle ? (
							<DetallesSkeleton />
						) : full ? (
							<>
								{full.rut_ejecutivo_comercial || full.nombre_ejecutivo_comercial ? (
									<FilaDetalle label='Ejecutivo comercial'>
										{full.nombre_ejecutivo_comercial || solicitud.ejecutivo_comercial}
										{full.rut_ejecutivo_comercial
											? ` (${full.rut_ejecutivo_comercial})`
											: null}
									</FilaDetalle>
								) : (
									<FilaDetalle label='Ejecutivo comercial'>
										{solicitud.ejecutivo_comercial}
									</FilaDetalle>
								)}

								{full.tipo === 'vida_guardia' && full.numero_guardias != null ? (
									<FilaDetalle label='Número de guardias'>
										{full.numero_guardias}
									</FilaDetalle>
								) : null}

								{full.tipo === 'unidades' && full.monto_asegurado_total != null ? (
									<FilaDetalle label='Monto asegurado total'>
										{full.monto_asegurado_total.toLocaleString('es-CL')}
									</FilaDetalle>
								) : null}

								{full.tipo === 'unidades' && full.nombre_excel ? (
									<FilaDetalle label='Archivo Excel'>
										{full.nombre_excel}
									</FilaDetalle>
								) : null}

								{full.tipo === 'accidentes_personales' &&
								full.actividades &&
								full.actividades.length > 0 ? (
									<div className='space-y-1.5'>
										<p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
											Actividades aseguradas
										</p>
										<div className='space-y-1'>
											{full.actividades.map((act, i) => (
												<div
													key={i}
													className='flex items-center justify-between gap-2 rounded-md border border-border/80 bg-muted/20 px-2 py-1.5'
												>
													<span className='text-sm text-foreground'>
														{act.actividad}
													</span>
													<Badge variant='outline' className='shrink-0 text-xs'>
														{act.numero_asegurados} asegurado
														{act.numero_asegurados !== 1 ? 's' : ''}
													</Badge>
												</div>
											))}
										</div>
									</div>
								) : null}

								{full.tipo === 'rc_condominio' ? (
									<>
										{full.actividad_del_condominio ? (
											<FilaDetalle label='Actividad del condominio'>
												{full.actividad_del_condominio}
											</FilaDetalle>
										) : null}
										{full.limite != null ? (
											<FilaDetalle label='Límite RC'>
												{full.limite.toLocaleString('es-CL')}
											</FilaDetalle>
										) : null}
									</>
								) : null}
							</>
						) : (
							<FilaDetalle label='Ejecutivo comercial'>
								{solicitud.ejecutivo_comercial}
							</FilaDetalle>
						)}

						<FilaDetalle label='Fecha de solicitud'>
							<span className='tabular-nums'>
								{formatFechaCorta(solicitud.fecha)}
							</span>
						</FilaDetalle>

						<FilaDetalle label='Prioridad'>
							<BadgePrioridad prioridad={solicitud.prioridad} />
						</FilaDetalle>

						{full?.recotizacion ? (
							<FilaDetalle label='Motivo de recotización'>
								{full.motivo_recotizacion || (
									<span className='italic text-muted-foreground'>Sin motivo registrado</span>
								)}
							</FilaDetalle>
						) : null}

						<Separator />

						<div className='space-y-2'>
							<h4 className='text-sm font-semibold'>Información faltante</h4>
							{solicitud.campos_faltantes.length > 0 ? (
								<div className='space-y-1.5'>
									{solicitud.campos_faltantes.map(campo => (
										<div
											key={campo}
											className='flex items-center gap-2 text-sm'
										>
											<CircleAlert className='h-4 w-4 shrink-0 text-amber-500' />
											<span className='text-muted-foreground'>
												{labelCampo(campo)}
											</span>
										</div>
									))}
								</div>
							) : (
								<p className='text-sm text-muted-foreground'>
									No hay información faltante.
								</p>
							)}
						</div>
					</div>
				</ScrollArea>

				<div className='border-t border-border px-4 py-3'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='h-8 w-full text-xs'
						onClick={() => onOpenChange(false)}
					>
						Cerrar
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	)
}
