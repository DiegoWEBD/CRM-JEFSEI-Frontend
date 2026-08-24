'use client'

import { useState } from 'react'
import type {
	ReporteProcesoComercial,
	ReporteProcesoComercialAbierto,
} from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/sheet'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { Label } from '@/components/label'
import { Textarea } from '@/components/textarea'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/alert-dialog'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'
import { useCerrarProcesoComercial } from '@/hooks/procesos-comerciales/use-cerrar-proceso-comercial'
import { useAceptarProcesoComercial } from '@/hooks/procesos-comerciales/use-aceptar-proceso-comercial'
import { useObtenerHistorialEstado } from '@/hooks/procesos-comerciales/use-obtener-historial-estado'
import HistorialEstadosTimeline from '@/components/historial-estados-timeline/historial-estados-timeline'
import { SEMAFORO_VARIANT } from '@/lib/badge-variants'

function esAbierto(
	r: ReporteProcesoComercial,
): r is ReporteProcesoComercialAbierto {
	return 'dias_transcurridos' in r
}

const PRIORIDAD_LABELS: Record<string, string> = {
	ROJO: 'Atrasado',
	AMARILLO: 'En riesgo',
	VERDE: 'En plazo',
	NO_APLICA: '—',
}

const PRIORIDAD_DOT: Record<string, string> = {
	ROJO: 'bg-destructive',
	AMARILLO: 'bg-warning',
	VERDE: 'bg-success',
	NO_APLICA: 'bg-muted-foreground/40',
}

type DetalleProcesoDrawerProps = {
	reporte: ReporteProcesoComercial | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function DetalleProcesoDrawer({
	reporte,
	open,
	onOpenChange,
}: DetalleProcesoDrawerProps) {
	const [estadoCierre, setEstadoCierre] = useState<'GANADO' | 'PERDIDO'>(
		'GANADO',
	)
	const [observacion, setObservacion] = useState('')
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [cerrarOpen, setCerrarOpen] = useState(false)

	const cerrarMutation = useCerrarProcesoComercial(reporte?.proceso.id ?? 0)
	const aceptarMutation = useAceptarProcesoComercial(reporte?.proceso.id ?? 0)
	const [aceptarConfirmOpen, setAceptarConfirmOpen] = useState(false)
	const { data: historial, isLoading: historialCargando } =
		useObtenerHistorialEstado(reporte?.proceso.id ?? 0)

	if (!reporte) return null

	const { proceso } = reporte
	const abierto = esAbierto(reporte)

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='flex flex-col gap-0 p-0 sm:max-w-md overflow-hidden'>
				<SheetHeader className='border-b border-border px-4 py-3'>
					<div className='flex items-center gap-2'>
						<span
							className={cn(
								'h-3 w-3 shrink-0 rounded-full',
								PRIORIDAD_DOT[reporte.estado_semaforo],
							)}
						/>
						<SheetTitle className='text-sm font-semibold'>
							{proceso.nombre_cliente}
						</SheetTitle>
					</div>
					<p className='text-xs text-muted-foreground'>{proceso.producto}</p>
					<Link
						href={`/prospectos/${proceso.id_prospecto}`}
						className='mt-1 text-sm text-primary underline-offset-2 hover:underline'
					>
						Ver prospecto →
					</Link>
				</SheetHeader>

				<div className='flex-1 overflow-y-auto px-4 py-3 space-y-4'>
					{/* Sección: Información General */}
					<div className='space-y-2.5'>
						<h3 className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
							Información General
						</h3>
						<div className='grid grid-cols-2 gap-x-4 gap-y-2.5'>
							<div className='space-y-0.5'>
								<p className='text-[11px] text-muted-foreground'>Etapa</p>
								<p className='text-sm font-medium text-foreground'>
									{proceso.etapa_actual.nombre}
								</p>
							</div>
							<div className='space-y-0.5'>
								<p className='text-[11px] text-muted-foreground'>Estado</p>
								<Badge
									variant={
										ESTADO_COMERCIAL_BADGE[
											proceso.estado_actual
												.codigo as keyof typeof ESTADO_COMERCIAL_BADGE
										] ?? 'outline'
									}
									className='text-xs font-semibold'
								>
									{ESTADO_PROSPECTO_LABELS[
										proceso.estado_actual
											.codigo as keyof typeof ESTADO_PROSPECTO_LABELS
									] ?? proceso.estado_actual.nombre}
								</Badge>
							</div>
							<div className='space-y-0.5'>
								<p className='text-[11px] text-muted-foreground'>
									Ejecutivo comercial
								</p>
								<p className='text-sm font-medium text-foreground'>
									{proceso.ejecutivo_comercial?.nombre ?? '—'}
								</p>
							</div>
							<div className='space-y-0.5'>
								<p className='text-[11px] text-muted-foreground'>Prioridad</p>
								<Badge
									variant={SEMAFORO_VARIANT[reporte.estado_semaforo]}
									className='text-xs font-medium'
								>
									{PRIORIDAD_LABELS[reporte.estado_semaforo]}
								</Badge>
							</div>
							{proceso.ejecutivo_evaluacion && (
								<div className='col-span-2 space-y-0.5'>
									<p className='text-[11px] text-muted-foreground'>
										Ejecutivo evaluación
									</p>
									<p className='text-sm font-medium text-foreground'>
										{proceso.ejecutivo_evaluacion.nombre}
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Sección: SLA y Seguimiento */}
					{abierto && (
						<div className='space-y-2.5'>
							<div className='border-t border-border/50 pt-3'>
								<h3 className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									SLA y Seguimiento
								</h3>
							</div>

							<div className='rounded-lg border border-border/70 bg-muted/20 p-3 space-y-2.5'>
								<div className='grid grid-cols-2 gap-x-4 gap-y-2'>
									<div className='space-y-0.5'>
										<p className='text-[11px] text-muted-foreground'>
											Ingreso etapa
										</p>
										<p className='text-sm font-medium tabular-nums text-foreground'>
											{new Date(reporte.fecha_ingreso_etapa).toLocaleDateString(
												'es-CL',
												{
													day: 'numeric',
													month: 'short',
													year: 'numeric',
												},
											)}
										</p>
									</div>
									<div className='space-y-0.5'>
										<p className='text-[11px] text-muted-foreground'>
											Transcurrido
										</p>
										<p className='text-sm font-medium tabular-nums text-foreground'>
											{reporte.dias_transcurridos} días
										</p>
									</div>
									<div className='space-y-0.5'>
										<p className='text-[11px] text-muted-foreground'>
											Límite SLA
										</p>
										<p className='text-sm font-medium tabular-nums text-foreground'>
											{proceso.etapa_actual.dias_limite != null
												? `${proceso.etapa_actual.dias_limite} días`
												: 'Sin límite'}
										</p>
									</div>
									<div className='space-y-0.5'>
										<p className='text-[11px] text-muted-foreground'>
											% Consumido
										</p>
										<Badge
											variant={
												reporte.porentaje_sla_consumido >= 1
													? 'pastel-red'
													: reporte.porentaje_sla_consumido >= 0.7
														? 'pastel-amber'
														: 'pastel-emerald'
											}
											className='text-xs font-medium'
										>
											{(reporte.porentaje_sla_consumido * 100).toFixed(0)}%
										</Badge>
									</div>
								</div>

								{/* Progress bar SLA */}
								<div className='space-y-1'>
									<div className='h-2 w-full overflow-hidden rounded-full bg-border/50'>
										<div
											className={cn(
												'h-full rounded-full transition-all',
												reporte.porentaje_sla_consumido >= 1
													? 'bg-destructive'
													: reporte.porentaje_sla_consumido >= 0.7
														? 'bg-warning'
														: 'bg-success',
											)}
											style={{
												width: `${Math.min(reporte.porentaje_sla_consumido * 100, 100)}%`,
											}}
										/>
									</div>
								</div>

								<div className='grid grid-cols-2 gap-x-4'>
									{reporte.dias_restantes >= 0 && (
										<div className='space-y-0.5'>
											<p className='text-[11px] text-muted-foreground'>
												Días restantes
											</p>
											<p className='text-sm font-medium tabular-nums text-foreground'>
												{reporte.dias_restantes}
											</p>
										</div>
									)}
									{reporte.dias_atraso > 0 && (
										<div className='space-y-0.5'>
											<p className='text-[11px] text-muted-foreground'>
												Días de atraso
											</p>
											<p className='text-sm font-medium tabular-nums text-destructive'>
												{reporte.dias_atraso}
											</p>
										</div>
									)}
								</div>

								<div className='rounded-md border border-border/70 bg-background p-2.5'>
									<p className='text-[11px] text-muted-foreground'>Mensaje</p>
									<p className='mt-0.5 text-sm font-medium text-foreground'>
										{reporte.mensaje_semaforo}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Sección: Historial */}
					<div className='space-y-2.5'>
						<div className='border-t border-border/50 pt-3'>
							<h3 className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
								Historial de Estados
							</h3>
						</div>
						<HistorialEstadosTimeline
							historial={historial}
							cargando={historialCargando}
						/>
					</div>

					{/* Acciones */}
					{abierto && (
						<div className='space-y-2.5 border-t border-border/50 pt-3'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								className='w-full text-xs shadow-none'
								disabled={aceptarMutation.isPending}
								onClick={() => setAceptarConfirmOpen(true)}
							>
								{aceptarMutation.isPending
									? 'Aceptando...'
									: 'Marcar aceptación del cliente'}
							</Button>

							{!cerrarOpen ? (
								<Button
									type='button'
									variant='destructive'
									size='sm'
									className='w-full text-xs shadow-none'
									onClick={() => setCerrarOpen(true)}
								>
									Cerrar oportunidad
								</Button>
							) : (
								<div className='space-y-2.5 rounded-lg border border-border/70 p-3'>
									<div className='space-y-1'>
										<Label className='text-xs text-muted-foreground'>
											Estado de cierre
										</Label>
										<Select
											value={estadoCierre}
											onValueChange={v =>
												setEstadoCierre(v as 'GANADO' | 'PERDIDO')
											}
										>
											<SelectTrigger className='h-8 text-xs shadow-none'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='GANADO' className='text-xs'>
													Ganado
												</SelectItem>
												<SelectItem value='PERDIDO' className='text-xs'>
													Perdido
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className='space-y-1'>
										<Label className='text-xs text-muted-foreground'>
											Observación{' '}
											<span className='text-muted-foreground/60'>
												(opcional)
											</span>
										</Label>
										<Textarea
											value={observacion}
											onChange={e => setObservacion(e.target.value)}
											placeholder='Motivo del cierre...'
											className='min-h-20 text-xs shadow-none'
										/>
									</div>
									<Button
										type='button'
										variant='destructive'
										size='sm'
										className='w-full text-xs shadow-none'
										disabled={cerrarMutation.isPending}
										onClick={() => setConfirmOpen(true)}
									>
										{cerrarMutation.isPending
											? 'Cerrando...'
											: 'Confirmar cierre'}
									</Button>
								</div>
							)}
						</div>
					)}

					{!abierto && (
						<div
							className={cn(
								'rounded-lg border p-3',
								proceso.estado_actual.codigo === 'GANADO'
									? 'border-success/30 bg-success/10'
									: 'border-destructive/30 bg-destructive/10',
							)}
						>
							<p
								className={cn(
									'text-sm font-medium',
									proceso.estado_actual.codigo === 'GANADO'
										? 'text-success'
										: 'text-destructive',
								)}
							>
								Proceso {proceso.estado_actual.nombre.toLowerCase()}
							</p>
						</div>
					)}
				</div>

				<SheetFooter className='border-t border-border px-4 py-3'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='w-full text-xs shadow-none'
						onClick={() => onOpenChange(false)}
					>
						Cerrar
					</Button>
				</SheetFooter>
			</SheetContent>

			<AlertDialog
				open={aceptarConfirmOpen}
				onOpenChange={setAceptarConfirmOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Marcar aceptación del cliente?</AlertDialogTitle>
						<AlertDialogDescription>
							Se registrará la aceptación del cliente para esta oportunidad.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<Button
							type='button'
							variant='default'
							size='sm'
							className='text-xs shadow-none'
							disabled={aceptarMutation.isPending}
							onClick={async () => {
								try {
									const response = await aceptarMutation.mutateAsync()
									toast.success(response.message)
									setAceptarConfirmOpen(false)
									onOpenChange(false)
								} catch {
									setAceptarConfirmOpen(false)
								}
							}}
						>
							{aceptarMutation.isPending
								? 'Aceptando...'
								: 'Confirmar aceptación'}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Cerrar oportunidad?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción es irreversible. La oportunidad quedará cerrada y no
							podrá modificarse.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<Button
							type='button'
							variant='destructive'
							size='sm'
							className='text-xs shadow-none'
							disabled={cerrarMutation.isPending}
							onClick={async () => {
								try {
									await cerrarMutation.mutateAsync({
										ganado: estadoCierre === 'GANADO',
										observacion: observacion.trim() || null,
									})
									toast.success('Oportunidad cerrada exitosamente')
									setConfirmOpen(false)
									setCerrarOpen(false)
									setObservacion('')
									onOpenChange(false)
								} catch {
									setConfirmOpen(false)
								}
							}}
						>
							{cerrarMutation.isPending ? 'Cerrando...' : 'Confirmar cierre'}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Sheet>
	)
}
