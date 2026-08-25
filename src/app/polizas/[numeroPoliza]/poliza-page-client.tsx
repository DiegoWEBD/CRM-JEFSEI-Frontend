'use client'

import ItemInformacionPoliza from '@/components/item-informacion-poliza/item-informacion-poliza'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import { Separator } from '@/components/separator/separator'
import { useObtenerPoliza } from '@/hooks/polizas/use-obtener-poliza'
import {
	ESTADO_POLIZA_PERFIL_LABELS,
	ESTADO_POLIZA_PERFIL_BADGE,
} from '@/lib/estados-cotizaciones'

import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import PanelBody from '@/components/paneles/panel-layout/panel-body/panel-body'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { formatUF } from '@/lib/uf'
import CardPlanPago from '@/app/polizas/[numeroPoliza]/card-plan-pago/card-plan-pago'
import { PolizaPageSkeleton } from '@/app/polizas/[numeroPoliza]/poliza-page-skeleton'
import CardHistorial from '@/app/polizas/[numeroPoliza]/card-historial/card-historial'
import DialogActualizarPoliza from '@/app/polizas/[numeroPoliza]/dialog-actualizar-poliza/dialog-actualizar-poliza'
import { useCancelarPoliza } from '@/hooks/polizas/use-cancelar-poliza'
import { useReactivarPoliza } from '@/hooks/polizas/use-reactivar-poliza'
import { useState } from 'react'
import ConfirmDialog from '@/components/confirm-dialog/confirm-dialog'
import {
	Building2,
	CalendarDays,
	Copy,
	ExternalLink,
	FileText,
	Loader2,
	Package,
	Pencil,
	Percent,
	Shield,
	User,
} from 'lucide-react'
import Link from 'next/link'

type PolizaPageClientProps = {
	numeroPoliza: string
}

function formatearFechaLarga(fecha: string | null | undefined): string {
	if (!fecha) return '—'
	return new Date(fecha).toLocaleDateString('es-CL', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}

export function PolizaPageClient({ numeroPoliza }: PolizaPageClientProps) {
	const { data: poliza, isLoading: polizaCargando } =
		useObtenerPoliza(numeroPoliza)
	const cancelarPoliza = useCancelarPoliza(numeroPoliza)
	const reactivarPoliza = useReactivarPoliza(numeroPoliza)
	const isLoadingMutation = cancelarPoliza.isPending || reactivarPoliza.isPending
	const [confirmarCancelar, setConfirmarCancelar] = useState(false)
	const [confirmarReactivar, setConfirmarReactivar] = useState(false)
	const [editarPoliza, setEditarPoliza] = useState(false)

	const handleCopiarNumero = () => {
		navigator.clipboard.writeText(numeroPoliza)
	}

	return (
		<PanelLayout>
			{polizaCargando ? (
				<PolizaPageSkeleton />
			) : poliza ? (
				<>
					<PanelHeader>
						<Card className='border-border shadow-none'>
							<CardContent className='p-4 sm:p-5 lg:p-6'>
								<div className='flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8'>
									<div className='min-w-0 flex-1 space-y-5'>
										<div className='flex items-start gap-3 sm:gap-4'>
											<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12'>
												<Shield className='h-5 w-5 sm:h-6 sm:w-6' aria-hidden />
											</div>
											<div className='min-w-0 flex-1 pt-0.5'>
												<div className='flex items-center gap-2.5'>
													<h1 className='text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl lg:text-2xl'>
														{poliza.numero_poliza}
													</h1>
													<button
														type='button'
														onClick={handleCopiarNumero}
														className='rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
														title='Copiar número de póliza'
													>
														<Copy className='h-3.5 w-3.5' aria-hidden />
													</button>
												</div>
												<div className='mt-1.5 flex flex-wrap items-center gap-2'>
													<Badge variant={ESTADO_POLIZA_PERFIL_BADGE[poliza.estado]} className='text-xs font-medium'>
														{ESTADO_POLIZA_PERFIL_LABELS[poliza.estado]}
													</Badge>
													<Badge variant='secondary' className='text-xs'>
														{poliza.tipo === 'nueva' ? 'Nueva' : 'Renovación'}
													</Badge>
												</div>
											</div>
										</div>

										<Separator />

										<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
											<div className='flex min-w-0 flex-1 items-center gap-2.5'>
												<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground'>
													<User className='h-3.5 w-3.5' aria-hidden />
												</div>
												<div className='min-w-0'>
													<p className='truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
														Cliente
													</p>
													<p className='truncate text-sm font-medium text-foreground'>
														<Link
															href={`/prospectos/${poliza.id_prospecto}`}
															className='inline-flex items-center gap-1.5 hover:underline'
														>
															{poliza.nombre_cliente}
															<ExternalLink className='h-3 w-3 shrink-0 text-muted-foreground' />
														</Link>
													</p>
												</div>
											</div>
											<div className='flex min-w-0 flex-1 items-center gap-2.5'>
												<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground'>
													<Building2 className='h-3.5 w-3.5' aria-hidden />
												</div>
												<div className='min-w-0'>
													<p className='truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
														Compañía
													</p>
													<p className='truncate text-sm font-medium text-foreground'>
														{poliza.company?.nombre ?? '—'}
													</p>
												</div>
											</div>
											<div className='flex min-w-0 flex-1 items-center gap-2.5'>
												<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground'>
													<Package className='h-3.5 w-3.5' aria-hidden />
												</div>
												<div className='min-w-0'>
													<p className='truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
														Producto
													</p>
													<p className='truncate text-sm font-medium text-foreground'>
														{poliza.nombre_producto}
													</p>
												</div>
											</div>
										</div>

										<div className='flex items-center gap-2'>
											<ItemInformacionPoliza
												label='Renovación cotizada'
												value={poliza.renovacion_cotizada}
											/>
										</div>
									</div>

									<Separator orientation='vertical' className='hidden self-stretch lg:block' />

									<div className='flex flex-col gap-3 lg:w-56 lg:shrink-0'>
										<div className='flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3 sm:p-4 lg:flex-col lg:items-start lg:gap-2'>
											<span className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
												Estado
											</span>
											<Badge variant={ESTADO_POLIZA_PERFIL_BADGE[poliza.estado]} className='text-xs font-medium'>
												{ESTADO_POLIZA_PERFIL_LABELS[poliza.estado]}
											</Badge>
										</div>
										<div className='flex items-center justify-center'>
											<AuthGuard
												allowedRoles={[
													'GERENTE_GENERAL',
													'GERENTE_COMERCIAL',
													'GERENTE_OPERACIONES',
												]}
												fallback={null}
											>
												<Button
													variant='outline'
													size='sm'
													className='h-8 w-full gap-1.5 text-xs'
													onClick={() => setEditarPoliza(true)}
												>
													<Pencil className='h-3.5 w-3.5' />
													Editar póliza
												</Button>
											</AuthGuard>
										</div>
									</div>
								</div>
							</CardContent>

							<AuthGuard
								allowedRoles={[
									'GERENTE_GENERAL',
									'GERENTE_COMERCIAL',
									'GERENTE_OPERACIONES',
								]}
								fallback={null}
							>
								<div className='border-t border-border px-4 py-3 sm:px-5 lg:px-6'>
									<div className='flex flex-wrap gap-2'>
										{poliza.estado === 'CANCELADA' ? (
											<>
												<Button
													variant='outline'
													size='sm'
													disabled={isLoadingMutation}
													onClick={() => setConfirmarReactivar(true)}
												>
													{reactivarPoliza.isPending ? (
														<Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
													) : null}
													Reactivar póliza
												</Button>
												<ConfirmDialog
													open={confirmarReactivar}
													onOpenChange={setConfirmarReactivar}
													title='¿Reactivar póliza?'
													description={`Se reactivará la póliza ${numeroPoliza}.`}
													confirmText='Reactivar'
													variant='default'
													isPending={reactivarPoliza.isPending}
													onConfirm={() => {
														setConfirmarReactivar(false)
														reactivarPoliza.mutateAsync()
													}}
												/>
											</>
										) : (
											<>
												<Button
													variant='outline'
													size='sm'
													disabled={isLoadingMutation}
													onClick={() => setConfirmarCancelar(true)}
												>
													{cancelarPoliza.isPending ? (
														<Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
													) : null}
													Cancelar póliza
												</Button>
												<ConfirmDialog
													open={confirmarCancelar}
													onOpenChange={setConfirmarCancelar}
													title='¿Cancelar póliza?'
													description={`Se cancelará la póliza ${numeroPoliza}. Esta acción puede revertirse posteriormente.`}
													confirmText='Cancelar'
													variant='destructive'
													isPending={cancelarPoliza.isPending}
													onConfirm={() => {
														setConfirmarCancelar(false)
														cancelarPoliza.mutateAsync()
													}}
												/>
											</>
										)}
									</div>
								</div>
							</AuthGuard>
						</Card>
					</PanelHeader>

					<Card className='border-border shadow-none'>
						<CardContent className='p-4 sm:p-5 lg:p-6'>
							<h2 className='mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
								Datos de la póliza
							</h2>
							<div className='grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3'>
								<ItemInformacionPoliza
									label='Número póliza'
									value={poliza.numero_poliza}
									icon={FileText}
								/>
								<ItemInformacionPoliza
									label='Prima neta'
									value={formatUF(poliza.prima_neta)}
								/>
								<ItemInformacionPoliza
									label='Comisión corredora'
									value={`${poliza.comision_corredora_pct} %`}
									icon={Percent}
								/>
								<ItemInformacionPoliza
									label='Fecha de emisión'
									value={formatearFechaLarga(poliza.fecha_emision)}
									icon={CalendarDays}
								/>
								<ItemInformacionPoliza
									label='Inicio de vigencia'
									value={formatearFechaLarga(poliza.inicio_vigencia)}
									icon={CalendarDays}
								/>
								<ItemInformacionPoliza
									label='Fin de vigencia'
									value={formatearFechaLarga(poliza.fin_vigencia)}
									icon={CalendarDays}
								/>
							</div>
						</CardContent>
					</Card>

					<PanelBody className='lg:grid-cols-[minmax(0,1fr)_30%]'>
						<AuthGuard
							allowedRoles={[
								'GERENTE_GENERAL',
								'GERENTE_COMERCIAL',
								'GERENTE_OPERACIONES',
								'EJECUTIVO_COBRANZA',
								'EJECUTIVO_COMERCIAL',
							]}
							fallback={null}
						>
							<CardPlanPago numeroPoliza={numeroPoliza} />
						</AuthGuard>
						<AuthGuard
							allowedRoles={[
								'GERENTE_GENERAL',
								'GERENTE_COMERCIAL',
								'GERENTE_OPERACIONES',
							]}
							fallback={null}
						>
							<CardHistorial idProcesoComercial={poliza.id_proceso_comercial} />
						</AuthGuard>
					</PanelBody>

					<DialogActualizarPoliza
						open={editarPoliza}
						onOpenChange={setEditarPoliza}
						poliza={poliza}
					/>
				</>
			) : (
				<Card className='border-border shadow-none'>
					<CardContent className='p-6 text-center'>
						<p className='text-sm text-muted-foreground'>
							No se encontró la póliza {numeroPoliza}
						</p>
					</CardContent>
				</Card>
			)}
		</PanelLayout>
	)
}
