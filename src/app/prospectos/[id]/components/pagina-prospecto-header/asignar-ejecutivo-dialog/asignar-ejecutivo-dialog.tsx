'use client'

import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import { Label } from '@/components/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { useAsignarEjecutivoCobranza } from '@/hooks/prospectos/use-asignar-ejecutivo-cobranza'
import { useAsignarEjecutivoComercial } from '@/hooks/prospectos/use-asignar-ejecutivo-comercial'
import { useAsignarEjecutivoEvaluacion } from '@/hooks/prospectos/use-asignar-ejecutivo-evaluacion'
import { useAsignarEjecutivoRenovacion } from '@/hooks/prospectos/use-asignar-ejecutivo-renovacion'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type AsignarEjecutivoDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	idProspecto: number
	idCliente?: number
	tipo: 'comercial' | 'evaluacion' | 'cobranza' | 'renovacion'
	ejecutivoActual?: string
}

const ROLE_MAP: Record<string, string> = {
	comercial: 'EJECUTIVO_COMERCIAL',
	evaluacion: 'EJECUTIVO_EVALUACION_PROYECTOS',
	cobranza: 'EJECUTIVO_COBRANZA',
	renovacion: 'EJECUTIVO_RENOVACION',
}

const TITLES: Record<string, string> = {
	comercial: 'Asignar ejecutivo comercial',
	evaluacion: 'Asignar ejecutivo de evaluación',
	cobranza: 'Asignar ejecutivo de cobranza',
	renovacion: 'Asignar ejecutivo de renovación',
}

const SUCCESS_MESSAGES: Record<string, string> = {
	comercial: 'Ejecutivo comercial asignado',
	evaluacion: 'Ejecutivo de evaluación asignado',
	cobranza: 'Ejecutivo de cobranza asignado',
	renovacion: 'Ejecutivo de renovación asignado',
}

const ERROR_MESSAGES: Record<string, string> = {
	comercial: 'Error al asignar ejecutivo comercial',
	evaluacion: 'Error al asignar ejecutivo de evaluación',
	cobranza: 'Error al asignar ejecutivo de cobranza',
	renovacion: 'Error al asignar ejecutivo de renovación',
}

export default function AsignarEjecutivoDialog({
	open,
	onOpenChange,
	idProspecto,
	idCliente,
	tipo,
	ejecutivoActual,
}: AsignarEjecutivoDialogProps) {
	const { data: usuarios, isLoading } = useUsuarios()

	const mutationComercial = useAsignarEjecutivoComercial(idProspecto)
	const mutationEvaluacion = useAsignarEjecutivoEvaluacion(idProspecto)
	const mutationCobranza = useAsignarEjecutivoCobranza(idProspecto, idCliente ?? 0)
	const mutationRenovacion = useAsignarEjecutivoRenovacion(idProspecto, idCliente ?? 0)

	const [rutSeleccionado, setRutSeleccionado] = useState(ejecutivoActual ?? '')

	const mutation =
		tipo === 'comercial'
			? mutationComercial
			: tipo === 'evaluacion'
				? mutationEvaluacion
				: tipo === 'cobranza'
					? mutationCobranza
					: mutationRenovacion

	const rolesFiltro = tipo === 'evaluacion'
		? ['EJECUTIVO_COMERCIAL', 'EJECUTIVO_EVALUACION_PROYECTOS']
		: [ROLE_MAP[tipo]]

	const usuariosFiltrados = (usuarios ?? []).filter(u =>
		u.roles.some(r => rolesFiltro.includes(r.codigo)),
	)

	async function handleSubmit() {
		try {
			const rut = rutSeleccionado === '__none__' ? null : rutSeleccionado
			if (tipo === 'comercial') {
				await mutationComercial.mutateAsync({ rut_ej_comercial: rut })
			} else if (tipo === 'evaluacion') {
				await mutationEvaluacion.mutateAsync({ rut_ej_evaluacion: rut })
			} else if (tipo === 'cobranza') {
				await mutationCobranza.mutateAsync({ rut_ej_cobranza: rut })
			} else {
				await mutationRenovacion.mutateAsync({ rut_ej_renovacion: rut })
			}
			toast.success(!rut ? 'Ejecutivo removido' : SUCCESS_MESSAGES[tipo])
			onOpenChange(false)
		} catch {
			toast.error(ERROR_MESSAGES[tipo])
		}
	}

	function handleOpenChange(open: boolean) {
		if (!open) {
			setRutSeleccionado(ejecutivoActual ?? '')
		}
		onOpenChange(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-sm gap-4'>
				<DialogHeader>
					<DialogTitle>{TITLES[tipo]}</DialogTitle>
				</DialogHeader>

				<div className='space-y-1.5'>
					<Label className='text-xs'>Ejecutivo</Label>
					{isLoading ? (
						<div className='flex h-9 items-center gap-2 text-sm text-muted-foreground'>
							<Loader2 className='h-4 w-4 animate-spin' aria-hidden />
							Cargando usuarios...
						</div>
					) : (
						<Select value={rutSeleccionado} onValueChange={setRutSeleccionado}>
							<SelectTrigger className='h-9 w-full text-sm'>
								<SelectValue placeholder='Seleccione ejecutivo' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='__none__' className='text-sm text-muted-foreground'>
									Sin ejecutivo
								</SelectItem>
								{usuariosFiltrados.map(u => (
									<SelectItem key={u.rut} value={u.rut} className='text-sm'>
										{u.nombre}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>

				{mutation.isError && (
					<p className='text-xs font-medium text-destructive' role='alert'>
						{mutation.error instanceof Error
							? mutation.error.message
							: 'Error al asignar ejecutivo'}
					</p>
				)}

				<DialogFooter className='gap-2'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() => handleOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						type='button'
						size='sm'
						disabled={mutation.isPending || isLoading}
						onClick={handleSubmit}
					>
						{mutation.isPending ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden />
						) : null}
						Asignar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
