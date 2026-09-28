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
import { useActualizarProbabilidadCierreEjecutivo } from '@/hooks/procesos-comerciales/use-actualizar-probabilidad-cierre-ejecutivo'
import { useUserSession } from '@/hooks/auth/use-user-session'
import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { Check, Loader2, Pencil, X } from 'lucide-react'
import { useState } from 'react'

type ProbabilidadCierreCellProps = {
	proceso: ProcesoComercial
	idProspecto: number
	ejecutivoComercialRut?: string
}

const OPCIONES_PROBABILIDAD = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

// Radix Select no admite items con value vacío, se usa un centinela
// para representar "sin estimación del ejecutivo" (usa la del sistema)
const VALOR_SISTEMA = 'sistema'

function formatearPorcentaje(valor: number): string {
	return `${Math.round(valor * 100)}%`
}

function obtenerValorInicial(proceso: ProcesoComercial): string {
	if (proceso.probabilidad_cierre_ejecutivo === null) {
		return VALOR_SISTEMA
	}

	return String(Math.round(proceso.probabilidad_cierre_ejecutivo * 100))
}

export default function ProbabilidadCierreCell({
	proceso,
	idProspecto,
	ejecutivoComercialRut,
}: ProbabilidadCierreCellProps) {
	const { usuario } = useUserSession()
	const [editando, setEditando] = useState(false)
	const [valorSeleccionado, setValorSeleccionado] = useState(VALOR_SISTEMA)
	const actualizarProbabilidad =
		useActualizarProbabilidadCierreEjecutivo(idProspecto)

	const puedeEditar = !proceso.cerrado && usuario?.rut === ejecutivoComercialRut

	function iniciarEdicion() {
		setValorSeleccionado(obtenerValorInicial(proceso))
		setEditando(true)
	}

	function cancelarEdicion() {
		setEditando(false)
		setValorSeleccionado(VALOR_SISTEMA)
	}

	async function guardar() {
		const probabilidad =
			valorSeleccionado === VALOR_SISTEMA
				? null
				: Number(valorSeleccionado) / 100

		await actualizarProbabilidad.mutateAsync({
			idProceso: proceso.id,
			request: {
				probabilidad_cierre_ejecutivo: probabilidad,
			},
		})

		setEditando(false)
		setValorSeleccionado(VALOR_SISTEMA)
	}

	return (
		<div className='flex flex-wrap items-center justify-between gap-2'>
			<div className='min-w-0 space-y-1.5'>
				<div>
					<p className='text-xs text-muted-foreground'>
						Probabilidad de cierre (sistema)
					</p>
					<p className='text-sm font-medium text-foreground'>
						{formatearPorcentaje(proceso.probabilidad_cierre_sistema)}
					</p>
				</div>

				<div>
					<p className='text-xs text-muted-foreground'>
						Probabilidad estimada por el ejecutivo
					</p>
					{editando ? (
						<Select
							value={valorSeleccionado}
							onValueChange={setValorSeleccionado}
						>
							<SelectTrigger size='sm' className='mt-1 h-8 w-44 gap-1 text-xs'>
								<SelectValue placeholder='Seleccione probabilidad' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={VALOR_SISTEMA}>
									Sin estimación (usar sistema)
								</SelectItem>
								{OPCIONES_PROBABILIDAD.map(opcion => (
									<SelectItem key={opcion} value={String(opcion)}>
										{opcion}%
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : (
						<p className='text-sm font-medium text-foreground'>
							{proceso.probabilidad_cierre_ejecutivo !== null
								? formatearPorcentaje(proceso.probabilidad_cierre_ejecutivo)
								: '—'}
						</p>
					)}
				</div>
			</div>

			{puedeEditar ? (
				<PermissionGuard
					allowedPermissions={['ADMINISTRAR_PROCESOS_COMERCIALES_PROPIOS']}
					fallback={null}
				>
					{editando ? (
						<div className='flex items-center gap-2'>
							<Button
								type='button'
								size='sm'
								className='h-8 gap-1 text-xs shadow-none'
								onClick={guardar}
								disabled={actualizarProbabilidad.isPending}
							>
								{actualizarProbabilidad.isPending ? (
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
								disabled={actualizarProbabilidad.isPending}
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
							<Pencil className='h-3 w-3' aria-hidden />
							{proceso.probabilidad_cierre_ejecutivo !== null
								? 'Editar'
								: 'Establecer'}
						</Button>
					)}
				</PermissionGuard>
			) : null}
		</div>
	)
}
