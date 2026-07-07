'use client'

import ItemInformacionPoliza from '@/components/item-informacion-poliza/item-informacion-poliza'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { useObtenerPoliza } from '@/hooks/polizas/use-obtener-poliza'
import {
	ESTADO_POLIZA_PERFIL_LABELS,
	ESTADO_POLIZA_PERFIL_BADGE,
} from '@/lib/estados-cotizaciones'
import { cn } from '@/lib/utils'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { formatUF } from '@/lib/uf'
import CardPlanPago from '@/app/polizas/[numeroPoliza]/card-plan-pago/card-plan-pago'
import { PolizaPageSkeleton } from '@/app/polizas/[numeroPoliza]/poliza-page-skeleton'
import CardHistorial from '@/app/polizas/[numeroPoliza]/card-historial/card-historial'
import { useCancelarPoliza } from '@/hooks/polizas/use-cancelar-poliza'
import { useReactivarPoliza } from '@/hooks/polizas/use-reactivar-poliza'
import {
	Building2,
	CalendarDays,
	FileText,
	Loader2,
	Package,
	Percent,
	User,
} from 'lucide-react'

type PolizaPageClientProps = {
	numeroPoliza: string
}

export function PolizaPageClient({ numeroPoliza }: PolizaPageClientProps) {
	const { data: poliza, isLoading: polizaCargando } =
		useObtenerPoliza(numeroPoliza)
	const cancelarPoliza = useCancelarPoliza(numeroPoliza)
	const reactivarPoliza = useReactivarPoliza(numeroPoliza)
	const isLoadingMutation = cancelarPoliza.isPending || reactivarPoliza.isPending

	return (
		<PanelLayout>
			{polizaCargando ? (
				<PolizaPageSkeleton />
			) : poliza ? (
				<div className='space-y-4'>
					<Card className='border-border shadow-none'>
						<CardHeader className='border-b border-border pb-2 pt-3'>
							<CardTitle className='text-sm font-semibold'>
								Datos póliza
							</CardTitle>
						</CardHeader>
						<CardContent className='p-4'>
							<div className='grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3'>
								<ItemInformacionPoliza
									label='Número póliza'
									value={poliza.numero_poliza}
									icon={FileText}
								/>
								<ItemInformacionPoliza
									label='Cliente'
									value='Los Pinos'
									icon={User}
								/>
								<ItemInformacionPoliza
									label='Compañía'
									value={poliza.company?.nombre ?? null}
									icon={Building2}
								/>
								<ItemInformacionPoliza
									label='Producto'
									value={poliza.nombre_producto}
									icon={Package}
								/>
								<ItemInformacionPoliza label='Estado'>
									<Badge
										variant='outline'
										className={cn(
											'text-[10px] font-medium',
											ESTADO_POLIZA_PERFIL_BADGE[poliza.estado],
										)}
									>
										{ESTADO_POLIZA_PERFIL_LABELS[poliza.estado]}
									</Badge>
								</ItemInformacionPoliza>
								<ItemInformacionPoliza
									label='Tipo'
									value={poliza.tipo === 'nueva' ? 'Nueva' : 'Renovación'}
								/>
								<ItemInformacionPoliza
									label='Renovación cotizada'
									value={poliza.renovacion_cotizada}
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
									value={
										poliza.fecha_emision
											? new Date(poliza.fecha_emision).toLocaleDateString(
													'es-CL',
													{
														day: 'numeric',
														month: 'short',
														year: 'numeric',
													},
												)
											: null
									}
									icon={CalendarDays}
								/>
								<ItemInformacionPoliza
									label='Inicio de vigencia'
									value={
										poliza.inicio_vigencia
											? new Date(poliza.inicio_vigencia).toLocaleDateString(
													'es-CL',
													{
														day: 'numeric',
														month: 'short',
														year: 'numeric',
													},
												)
											: null
									}
									icon={CalendarDays}
								/>
								<ItemInformacionPoliza
									label='Fin de vigencia'
									value={
										poliza.fin_vigencia
											? new Date(poliza.fin_vigencia).toLocaleDateString(
													'es-CL',
													{
														day: 'numeric',
														month: 'short',
														year: 'numeric',
													},
												)
											: null
									}
									icon={CalendarDays}
								/>
							</div>
						</CardContent>
					</Card>

					<AuthGuard
						allowedRoles={[
							'GERENTE_GENERAL',
							'GERENTE_COMERCIAL',
							'GERENTE_OPERACIONES',
						]}
						fallback={null}
					>
						<Card className='border-border shadow-none'>
							<CardHeader className='border-b border-border pb-1 pt-2'>
								<CardTitle className='text-sm font-semibold'>Acciones</CardTitle>
							</CardHeader>
							<CardContent className='p-4'>
								<div className='flex flex-wrap gap-2'>
									{poliza.estado === 'CANCELADA' ? (
										<Button
											variant='outline'
											size='sm'
											disabled={isLoadingMutation}
											onClick={() => reactivarPoliza.mutateAsync()}
										>
											{reactivarPoliza.isPending ? (
												<Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
											) : null}
											Reactivar póliza
										</Button>
									) : (
										<Button
											variant='outline'
											size='sm'
											disabled={isLoadingMutation}
											onClick={() => cancelarPoliza.mutateAsync()}
										>
											{cancelarPoliza.isPending ? (
												<Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
											) : null}
											Cancelar póliza
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					</AuthGuard>

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
				</div>
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
