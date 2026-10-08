'use client'

import { Button } from '@/components/button'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { useCambiarEstadoManual } from '@/hooks/procesos-comerciales/use-cambiar-estado-manual'
import { useTransicionesManuales } from '@/hooks/procesos-comerciales/use-transiciones-manuales'
import { useUserSession } from '@/hooks/auth/use-user-session'
import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'
import { ArrowRight, Check, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type SelectorEstadoOportunidadProps = {
	proceso: ProcesoComercial
	idProspecto: number
	ejecutivoComercialRut?: string
}

// Radix Select no admite items con value vacío; se usa un centinela para
// representar "sin selección"
const VALOR_INICIAL = '__ninguno__'

export default function SelectorEstadoOportunidad({
	proceso,
	idProspecto,
	ejecutivoComercialRut,
}: SelectorEstadoOportunidadProps) {
	const { usuario } = useUserSession()
	const [editando, setEditando] = useState(false)
	const [valorSeleccionado, setValorSeleccionado] = useState(VALOR_INICIAL)
	const { data: transiciones, isLoading: cargandoTransiciones } =
		useTransicionesManuales(proceso.id)
	const cambiarEstado = useCambiarEstadoManual(idProspecto)

	const puedeEditar = !proceso.cerrado && usuario?.rut === ejecutivoComercialRut

	function iniciarEdicion() {
		setValorSeleccionado(VALOR_INICIAL)
		setEditando(true)
	}

	function cancelarEdicion() {
		setEditando(false)
		setValorSeleccionado(VALOR_INICIAL)
	}

	async function guardar() {
		if (valorSeleccionado === VALOR_INICIAL) return

		const transicionSeleccionada = transiciones?.find(
			t => t.codigo === valorSeleccionado,
		)

		try {
			await cambiarEstado.mutateAsync({
				idProceso: proceso.id,
				request: {
					codigo_estado_destino: valorSeleccionado,
					observacion: transicionSeleccionada?.accion_requerida ?? null,
				},
			})
			toast.success('Estado de la oportunidad actualizado')
			setEditando(false)
			setValorSeleccionado(VALOR_INICIAL)
		} catch {
			toast.error('Error al cambiar el estado de la oportunidad')
		}
	}

	if (!puedeEditar) {
		return null
	}

	const nombreEstadoActual =
		ESTADO_PROSPECTO_LABELS[
			proceso.estado_actual.codigo as keyof typeof ESTADO_PROSPECTO_LABELS
		] ?? proceso.estado_actual.nombre

	return (
		<PermissionGuard
			allowedPermissions={['ADMINISTRAR_PROCESOS_COMERCIALES_PROPIOS']}
			fallback={null}
		>
			<div className='flex flex-wrap items-center justify-between gap-2 border-t border-border/30 pt-2'>
				<div className='min-w-0 space-y-1.5'>
					<div>
						<p className='text-xs text-muted-foreground'>Estado actual</p>
						<p className='text-sm font-medium text-foreground'>
							{nombreEstadoActual}
						</p>
					</div>

					{editando && (
						<div>
							<p className='text-xs text-muted-foreground'>Cambiar a</p>
							<Select
								value={valorSeleccionado}
								onValueChange={setValorSeleccionado}
							>
								<SelectTrigger
									size='sm'
									className='mt-1 h-8 w-56 gap-1 text-xs'
								>
									<SelectValue placeholder='Seleccione estado' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={VALOR_INICIAL} disabled>
										Seleccione un estado
									</SelectItem>
									{transiciones?.map(transicion => (
										<SelectItem
											key={transicion.codigo}
											value={transicion.codigo}
										>
											{transicion.nombre}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</div>

				{editando ? (
					<div className='flex items-center gap-2'>
						<Button
							type='button'
							size='sm'
							className='h-8 gap-1 text-xs shadow-none'
							onClick={guardar}
							disabled={
								valorSeleccionado === VALOR_INICIAL || cambiarEstado.isPending
							}
						>
							{cambiarEstado.isPending ? (
								<Loader2 className='h-3.5 w-3.5 animate-spin' aria-hidden />
							) : (
								<Check className='h-3.5 w-3.5' aria-hidden />
							)}
							Guardar
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-8 gap-1 text-xs shadow-none'
							onClick={cancelarEdicion}
							disabled={cambiarEstado.isPending}
						>
							<X className='h-3.5 w-3.5' aria-hidden />
							Cancelar
						</Button>
					</div>
				) : (
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='h-7 gap-1 text-xs shadow-none'
						onClick={iniciarEdicion}
					>
						{cargandoTransiciones ? (
							<Loader2 className='h-3 w-3 animate-spin' aria-hidden />
						) : (
							<ArrowRight className='h-3 w-3' aria-hidden />
						)}
						Cambiar estado
					</Button>
				)}
			</div>
		</PermissionGuard>
	)
}
