'use client'

import {
	EstadoConfiguracion,
} from '@/aplicacion/estados-admin/dto/estado-configuracion'
import { TransicionAdmin } from '@/aplicacion/estados-admin/dto/transicion-admin'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/dialog'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { ScrollArea } from '@/components/scroll-area'
import { Skeleton } from '@/components/skeleton'
import { useEliminarTransicion } from '@/hooks/estados-admin/use-eliminar-transicion'
import { useTransicionesEstado } from '@/hooks/estados-admin/use-transiciones-estado'
import { Lock, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import DialogEditarTransicion from './dialog-editar-transicion'
import DialogRegistrarTransicion from './dialog-registrar-transicion'
import { formatearDiasLimite } from './formato-estados'

type TransicionesEstadoProps = {
	/** Estado de origen cuyas transiciones se administran. */
	estado: EstadoConfiguracion
	/** Listado completo de estados, para armar el select de destinos. */
	estados: EstadoConfiguracion[]
	onCerrar: () => void
}

function ChipTransicion({ transicion }: { transicion: TransicionAdmin }) {
	return (
		<div className='flex flex-wrap items-center gap-1.5'>
			{transicion.es_principal ? (
				<>
					<Badge variant='pastel-indigo'>
						<Lock className='size-3' />
						Principal
					</Badge>
					<Badge
						variant={
							transicion.dias_limite === null
								? 'pastel-muted'
								: 'pastel-amber'
						}
					>
						{formatearDiasLimite(transicion.dias_limite)}
					</Badge>
				</>
			) : null}
			<Badge variant={transicion.es_manual ? 'pastel-sky' : 'pastel-muted'}>
				{transicion.es_manual ? 'Manual' : 'Automática'}
			</Badge>
		</div>
	)
}

export default function TransicionesEstado({
	estado,
	estados,
	onCerrar,
}: TransicionesEstadoProps) {
	const { data, isFetching, isLoading } = useTransicionesEstado(estado.codigo)
	const transiciones = data?.data ?? []

	const eliminarMutation = useEliminarTransicion()

	const [dialogRegistroAbierto, setDialogRegistroAbierto] = useState(false)
	const [transicionAEditar, setTransicionAEditar] =
		useState<TransicionAdmin | null>(null)
	const [transicionAEliminar, setTransicionAEliminar] =
		useState<TransicionAdmin | null>(null)

	const destinosDisponibles = estados.filter(
		est =>
			est.codigo !== estado.codigo &&
			!transiciones.some(t => t.codigo_estado_destino === est.codigo),
	)

	return (
		<>
			<Dialog open onOpenChange={open => !open && onCerrar()}>
				<DialogContent className='sm:max-w-2xl'>
					<DialogTitle className='truncate pr-8'>
						Transiciones desde «{estado.nombre}»
					</DialogTitle>
					<DialogDescription>
						Caminos que puede seguir una oportunidad al salir de este estado.
					</DialogDescription>

					<div className='flex justify-end'>
						<PermissionGuard allowedPermissions={['ADMINISTRAR_ESTADOS_PROCESO_COMERCIAL']}>
							<Button
								type='button'
								size='sm'
								disabled={destinosDisponibles.length === 0}
								title={
									destinosDisponibles.length === 0
										? 'No quedan estados de destino disponibles'
										: undefined
								}
								onClick={() => setDialogRegistroAbierto(true)}
							>
								<Plus className='size-4' />
								Agregar transición
							</Button>
						</PermissionGuard>
					</div>

					<ScrollArea className='max-h-[55vh]'>
						{isFetching && isLoading ? (
							<div className='space-y-2 pr-3'>
								{Array.from({ length: 3 }).map((_, i) => (
									<Skeleton key={i} className='h-12 w-full rounded-md' />
								))}
							</div>
						) : transiciones.length === 0 ? (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-muted-foreground'>
									Este estado no tiene transiciones registradas.
								</p>
							</div>
						) : (
							<ul className='divide-y divide-border/50 rounded-lg border border-border pr-3'>
								{transiciones.map(transicion => (
									<li
										key={transicion.codigo_estado_destino}
										className='flex flex-wrap items-start justify-between gap-3 p-3'
									>
										<div className='min-w-0 flex-1 space-y-1.5'>
											<p className='truncate text-sm font-semibold text-foreground'>
												{transicion.nombre_estado_destino}
											</p>
											<ChipTransicion transicion={transicion} />
											{transicion.accion_requerida && (
												<p className='text-xs text-muted-foreground'>
													Acción: {transicion.accion_requerida}
												</p>
											)}
										</div>

										<PermissionGuard allowedPermissions={['ADMINISTRAR_ESTADOS_PROCESO_COMERCIAL']}>
											<div className='flex shrink-0 items-center gap-1'>
												<Button
													variant='ghost'
													size='icon'
													className='size-8'
													title={
														transicion.es_principal
															? 'Configurar días límite (SLA)'
															: 'Editar transición'
													}
													onClick={() => setTransicionAEditar(transicion)}
												>
													<Pencil className='size-4' />
												</Button>

												<Button
													variant='ghost'
													size='icon'
													className='size-8 text-destructive hover:text-destructive'
													disabled={transicion.es_principal}
													title={
														transicion.es_principal
															? 'Las transiciones principales no se pueden eliminar'
															: 'Eliminar transición'
													}
													onClick={() => setTransicionAEliminar(transicion)}
												>
													<Trash2 className='size-4' />
												</Button>
											</div>
										</PermissionGuard>
									</li>
								))}
							</ul>
						)}
					</ScrollArea>
				</DialogContent>
			</Dialog>

			{dialogRegistroAbierto && (
				<DialogRegistrarTransicion
					estado={estado}
					destinos={destinosDisponibles}
					dialogAbierto={dialogRegistroAbierto}
					cerrarDialog={() => setDialogRegistroAbierto(false)}
				/>
			)}

			{transicionAEditar && (
				<DialogEditarTransicion
					key={`${transicionAEditar.codigo_estado_origen}-${transicionAEditar.codigo_estado_destino}`}
					estado={estado}
					transicion={transicionAEditar}
					dialogAbierto={transicionAEditar !== null}
					cerrarDialog={() => setTransicionAEditar(null)}
				/>
			)}

			<ConfirmDialog
				open={transicionAEliminar !== null}
				onOpenChange={open => {
					if (!open) setTransicionAEliminar(null)
				}}
				title='¿Eliminar transición?'
				description={`La oportunidad dejará de poder ir de «${estado.nombre}» hacia «${transicionAEliminar?.nombre_estado_destino ?? ''}».`}
				confirmText='Eliminar'
				onConfirm={() => {
					if (transicionAEliminar) {
						eliminarMutation.mutate({
							codigo_estado_origen: transicionAEliminar.codigo_estado_origen,
							codigo_estado_destino:
								transicionAEliminar.codigo_estado_destino,
						})
						setTransicionAEliminar(null)
					}
				}}
				isPending={eliminarMutation.isPending}
			/>
		</>
	)
}
