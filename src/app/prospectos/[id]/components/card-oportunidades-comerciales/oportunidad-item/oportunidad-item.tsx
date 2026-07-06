'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Skeleton } from '@/components/skeleton'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'
import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Plus, Upload } from 'lucide-react'
import { useState } from 'react'
import { useObtenerSolicitudesPorProceso } from '@/hooks/solicitudes-cotizacion/use-obtener-solicitudes-por-proceso'
import { useUserSession } from '@/hooks/auth/use-user-session'
import SolicitudCotizacionItem from '../../card-solicitudes-cotizacion/solicitud-cotizacion-item/solicitud-cotizacion-item'
import DialogNuevaSolicitudCotizacion from '@/components/solicitud-cotizacion/dialog-nueva-solicitud-cotizacion'
import SheetRegistrarPoliza from '../sheet-registrar-poliza/sheet-registrar-poliza'

type OportunidadItemProps = {
	proceso: ProcesoComercial
	idProspecto: number
	idCliente?: number
	informacionCompleta: boolean
	nombreCliente: string
	lineaNegocioNombre: string
	ejecutivoComercialRut?: string
	ejecutivoEvaluacionRut?: string
}

export default function OportunidadItem({
	proceso,
	idProspecto,
	idCliente,
	informacionCompleta,
	nombreCliente,
	lineaNegocioNombre,
	ejecutivoComercialRut,
	ejecutivoEvaluacionRut,
}: OportunidadItemProps) {
	const { usuario } = useUserSession()
	const [expandido, setExpandido] = useState(false)
	const [openNuevaSolicitud, setOpenNuevaSolicitud] = useState(false)
	const [openRegistrarPoliza, setOpenRegistrarPoliza] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(0)
	const { data: solicitudes, isLoading } = useObtenerSolicitudesPorProceso(
		proceso.id,
	)

	const esDualRol = ejecutivoComercialRut === ejecutivoEvaluacionRut

	return (
		<>
			<div
				className={cn(
					'rounded-md border border-border bg-card transition-colors',
					expandido && 'border-primary/30',
				)}
			>
				<button
					type='button'
					onClick={() => setExpandido(!expandido)}
					className='flex w-full flex-wrap items-start gap-1.5 px-3 py-2.5 text-left sm:flex-nowrap sm:items-center sm:gap-3'
				>
					{expandido ? (
						<ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground' />
					) : (
						<ChevronRight className='h-4 w-4 shrink-0 text-muted-foreground' />
					)}

					<div className='flex min-w-0 flex-1 items-center gap-3'>
						<span className='truncate text-sm font-medium text-foreground'>
							{proceso.producto}
						</span>

						<Badge
							variant='outline'
							className={cn(
								'shrink-0 px-2 py-0.5 text-[10px] font-semibold leading-none',
								ESTADO_COMERCIAL_BADGE[
									proceso.estado_actual
										.codigo as keyof typeof ESTADO_COMERCIAL_BADGE
								] ?? 'border-border bg-muted/50 text-muted-foreground',
							)}
						>
							{ESTADO_PROSPECTO_LABELS[
								proceso.estado_actual
									.codigo as keyof typeof ESTADO_PROSPECTO_LABELS
							] ?? proceso.estado_actual.nombre}
						</Badge>

						{proceso.cerrado && (
							<Badge
								variant='outline'
								className='shrink-0 border-muted-foreground/30 bg-muted/30 px-2 py-0.5 text-[10px] font-semibold leading-none text-muted-foreground'
							>
								Cerrado
							</Badge>
						)}
					</div>

					<span className='shrink-0 text-[11px] text-muted-foreground'>
						{proceso.ejecutivo_comercial?.nombre ?? '—'}
					</span>
				</button>

				{expandido && (
					<div className='border-t border-border/50 px-3 pb-3 pt-2'>
						{isLoading ? (
							<div className='space-y-2'>
								<Skeleton className='h-12 w-full' />
								<Skeleton className='h-12 w-full' />
							</div>
						) : solicitudes && solicitudes.length > 0 ? (
							<div>
								{solicitudes.length > 1 ? (
									<div className='mb-2 flex flex-wrap gap-1.5'>
										{solicitudes.map((s, i) => (
											<button
												key={s.id}
												type='button'
												onClick={() => setSelectedIndex(i)}
												className={cn(
													'rounded px-2.5 py-1 text-xs font-medium transition-colors',
													i === selectedIndex
														? 'bg-primary text-primary-foreground'
														: 'bg-muted text-muted-foreground hover:bg-muted/80',
												)}
											>
												{s.producto}
											</button>
										))}
									</div>
								) : null}

								{solicitudes[selectedIndex] ? (
									<SolicitudCotizacionItem
										key={solicitudes[selectedIndex].id}
										solicitud={solicitudes[selectedIndex]}
										informacionCompleta={informacionCompleta}
										idProspecto={idProspecto}
										nombreCliente={nombreCliente}
										lineaNegocioNombre={lineaNegocioNombre}
										ejecutivoEvaluacionRut={ejecutivoEvaluacionRut}
										gestionesAbiertasPorDefecto
										ocultarToggle
									/>
								) : null}
							</div>
						) : (
							<p className='py-2 text-center text-xs text-muted-foreground'>
								No hay solicitudes de cotización para esta oportunidad.
							</p>
						)}

						{!proceso.cerrado && usuario?.rut === ejecutivoComercialRut ? (
							<div className='mt-2 flex flex-col gap-2 border-t border-border/30 pt-2 sm:flex-row sm:items-center'>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-7 gap-1 text-xs shadow-none'
									onClick={() => setOpenRegistrarPoliza(true)}
								>
									<Upload className='h-3 w-3' aria-hidden />
									Subir póliza
								</Button>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-7 gap-1 text-xs shadow-none'
									onClick={() => setOpenNuevaSolicitud(true)}
								>
									<Plus className='h-3 w-3' aria-hidden />
									{esDualRol ? 'Iniciar cotizaciones' : 'Solicitar cotización'}
								</Button>
							</div>
						) : null}
					</div>
				)}
			</div>

			<DialogNuevaSolicitudCotizacion
				open={openNuevaSolicitud}
				onOpenChange={setOpenNuevaSolicitud}
				idProspecto={idProspecto}
				nombreCliente={nombreCliente}
				lineaNegocioNombre={lineaNegocioNombre}
				tipoPredefinido={proceso.tipo_producto}
				idProceso={proceso.id}
			/>

			<SheetRegistrarPoliza
				open={openRegistrarPoliza}
				onOpenChange={setOpenRegistrarPoliza}
				idProceso={proceso.id}
				idProspecto={idProspecto}
				idCliente={idCliente}
				nombreCliente={nombreCliente}
				producto={proceso.producto}
			/>
		</>
	)
}
