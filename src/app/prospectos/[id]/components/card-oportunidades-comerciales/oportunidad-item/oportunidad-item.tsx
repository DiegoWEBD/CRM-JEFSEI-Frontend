'use client'

import { BadgeEstadoOportunidad } from '@/components/badge/badge-estado-oportunidad/badge-estado-oportunidad'
import { BadgeProbabilidadCierre } from '@/components/badge/badge-probabilidad-cierre/badge-probabilidad-cierre'
import { Button } from '@/components/button'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { Skeleton } from '@/components/skeleton'
import DialogNuevaSolicitudCotizacion from '@/components/solicitud-cotizacion/dialog-nueva-solicitud-cotizacion'
import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { useObtenerSolicitudesPorProceso } from '@/hooks/solicitudes-cotizacion/use-obtener-solicitudes-por-proceso'
import { formatUF } from '@/lib/uf'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Plus, Upload } from 'lucide-react'
import { useState } from 'react'
import SolicitudCotizacionItem from '../../card-solicitudes-cotizacion/solicitud-cotizacion-item/solicitud-cotizacion-item'
import SheetRegistrarPoliza from '../sheet-registrar-poliza/sheet-registrar-poliza'
import FechaEstimadaCierreCell from './fecha-estimada-cierre-cell'
import ProbabilidadCierreCell from './probabilidad-cierre-cell'
import SelectorEstadoOportunidad from './selector-estado-oportunidad'
import { formatearFecha } from '@/utils/formatear-fecha'

type OportunidadItemProps = {
	proceso: ProcesoComercial
	idProspecto: number
	idCliente?: number
	informacionCompleta: boolean
	nombreCliente: string
	lineaNegocioNombre: string
	ejecutivoComercialRut?: string
	ejecutivoEvaluacionRut?: string
	ejecutivoRenovacionRut?: string
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
	ejecutivoRenovacionRut,
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
	const probabilidadEjecutivo = proceso.probabilidad_cierre_ejecutivo
	const probabilidadEfectiva =
		probabilidadEjecutivo ?? proceso.probabilidad_cierre_sistema

	const esEjecutivoComercial = usuario?.rut === ejecutivoComercialRut
	const esEjecutivoRenovacion = usuario?.rut === ejecutivoRenovacionRut
	const puedeSubirPoliza =
		(!proceso.cerrado && esEjecutivoComercial) || esEjecutivoRenovacion
	const puedeSolicitarCotizacion = !proceso.cerrado && esEjecutivoComercial

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
					<div className='flex min-w-0 flex-col items-start sm:flex-row sm:items-center gap-3 w-full'>
						<div className='flex gap-3 justify-between w-full sm:w-fit'>
							<div className='flex gap-1 items-center'>
								{expandido ? (
									<ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground' />
								) : (
									<ChevronRight className='h-4 w-4 shrink-0 text-muted-foreground' />
								)}
								<span className='truncate text-sm font-medium text-foreground'>
									{proceso.producto}
								</span>
							</div>

							<BadgeProbabilidadCierre
								probabilidad={probabilidadEfectiva}
								className='sm:hidden'
							/>
						</div>

						{!expandido && (
							<BadgeEstadoOportunidad estado={proceso.estado_actual} />
						)}

						<BadgeProbabilidadCierre
							probabilidad={probabilidadEfectiva}
							className='hidden sm:block'
						/>
					</div>
				</button>

				{expandido && (
					<div className='border-t border-border/50 px-3 pb-3'>
						{/* Resumen: estado + proyección en una fila, montos en otra. */}
						<div className='my-3 space-y-3'>
							<div className='grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4'>
								<PermissionGuard
									allowedPermissions={[
										'ADMINISTRAR_PROCESOS_COMERCIALES_PROPIOS',
									]}
									fallback={null}
								>
									{/* Envuelve el fragmento interno para que ocupe una sola celda de la grícula. */}
									<div className='min-w-0'>
										<SelectorEstadoOportunidad
											proceso={proceso}
											idProspecto={idProspecto}
											ejecutivoComercialRut={ejecutivoComercialRut}
										/>
									</div>
								</PermissionGuard>

								<div className='min-w-0'>
									<p className='text-xs text-muted-foreground'>
										Probabilidad de cierre (sistema)
									</p>
									<p className='mt-0.5 text-sm font-medium tabular-nums text-foreground'>
										{Math.round(proceso.probabilidad_cierre_sistema * 100)}%
									</p>
								</div>

								<ProbabilidadCierreCell
									proceso={proceso}
									idProspecto={idProspecto}
									ejecutivoComercialRut={ejecutivoComercialRut}
								/>
								<FechaEstimadaCierreCell
									proceso={proceso}
									idProspecto={idProspecto}
									ejecutivoComercialRut={ejecutivoComercialRut}
								/>
							</div>

							<div className='grid gap-x-4 gap-y-3 border-t border-border/40 pt-3 sm:grid-cols-3'>
								<div className='min-w-0'>
									<p className='text-xs text-muted-foreground'>
										Prima cotizada
									</p>
									<p className='mt-0.5 text-sm font-medium tabular-nums text-foreground'>
										{formatUF(proceso.prima_cotizada)}
									</p>
								</div>

								<div className='min-w-0'>
									<p className='text-xs text-muted-foreground'>
										Prima esperada
									</p>
									<p className='mt-0.5 text-sm font-medium tabular-nums text-foreground'>
										{formatUF(proceso.prima_esperada)}
									</p>
								</div>

								<div className='min-w-0'>
									<p className='text-xs text-muted-foreground'>
										Prima potencial estimada
									</p>
									<p className='mt-0.5 text-sm font-medium tabular-nums text-foreground'>
										{formatUF(proceso.prima_potencial_estimada)}
									</p>
								</div>
							</div>
						</div>
						{isLoading ? (
							<div className='space-y-2'>
								<Skeleton className='h-12 w-full' />
								<Skeleton className='h-12 w-full' />
							</div>
						) : solicitudes && solicitudes.length > 0 ? (
							<div>
								{solicitudes.length > 1 ? (
									<div className='mb-2 flex flex-wrap gap-1.5'>
										{solicitudes.map((solicitud, i) => (
											<button
												key={solicitud.id}
												type='button'
												onClick={() => setSelectedIndex(i)}
												className={cn(
													'rounded px-2.5 py-1 text-xs font-medium transition-colors',
													i === selectedIndex
														? 'bg-primary text-primary-foreground'
														: 'bg-muted text-muted-foreground hover:bg-muted/80',
												)}
											>
												Solicitud {i + 1} ·{' '}
												{formatearFecha(
													new Date(solicitud.fecha),
													'dd-MM-yyyy',
												)}
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
										idProceso={proceso.id}
										nombreCliente={nombreCliente}
										lineaNegocioNombre={lineaNegocioNombre}
										ejecutivoComercialRut={ejecutivoComercialRut}
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

						{puedeSubirPoliza || puedeSolicitarCotizacion ? (
							<div className='mt-3 flex flex-col gap-2 border-t border-border/50 pt-3 sm:flex-row sm:items-center'>
								{puedeSubirPoliza ? (
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
								) : null}

								{puedeSolicitarCotizacion ? (
									<Button
										type='button'
										variant='outline'
										size='sm'
										className='h-7 gap-1 text-xs shadow-none'
										onClick={() => setOpenNuevaSolicitud(true)}
									>
										<Plus className='h-3 w-3' aria-hidden />
										{esDualRol
											? 'Iniciar cotizaciones'
											: 'Solicitar cotización'}
									</Button>
								) : null}
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
