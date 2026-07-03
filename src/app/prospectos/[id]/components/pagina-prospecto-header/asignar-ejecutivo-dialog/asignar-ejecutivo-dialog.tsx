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
import { useAsignarEjecutivoComercial } from '@/hooks/prospectos/use-asignar-ejecutivo-comercial'
import { useAsignarEjecutivoEvaluacion } from '@/hooks/prospectos/use-asignar-ejecutivo-evaluacion'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type AsignarEjecutivoDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	idProspecto: number
	tipo: 'comercial' | 'evaluacion'
	ejecutivoActual?: string
}

export default function AsignarEjecutivoDialog({
	open,
	onOpenChange,
	idProspecto,
	tipo,
	ejecutivoActual,
}: AsignarEjecutivoDialogProps) {
	const { data: usuarios, isLoading } = useUsuarios()
	const mutationComercial = useAsignarEjecutivoComercial(idProspecto)
	const mutationEvaluacion = useAsignarEjecutivoEvaluacion(idProspecto)
	const [rutSeleccionado, setRutSeleccionado] = useState(ejecutivoActual ?? '')

	const mutation = tipo === 'comercial' ? mutationComercial : mutationEvaluacion
	const usuariosFiltrados = (usuarios ?? []).filter(u =>
		u.roles.some(
			r =>
				r.codigo === 'EJECUTIVO_COMERCIAL' ||
				r.codigo === 'EJECUTIVO_EVALUACION_PROYECTOS',
		),
	)

	async function handleSubmit() {
		try {
			const rut = rutSeleccionado === '__none__' ? null : rutSeleccionado
			if (tipo === 'comercial') {
				await mutationComercial.mutateAsync({
					rut_ej_comercial: rut,
				})
			} else {
				await mutationEvaluacion.mutateAsync({
					rut_ej_evaluacion: rut,
				})
			}
			toast.success(
				!rut
					? 'Ejecutivo removido'
					: tipo === 'comercial'
						? 'Ejecutivo comercial asignado'
						: 'Ejecutivo de evaluación asignado',
			)
			onOpenChange(false)
		} catch {
			toast.error(
				tipo === 'comercial'
					? 'Error al asignar ejecutivo comercial'
					: 'Error al asignar ejecutivo de evaluación',
			)
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
					<DialogTitle>
						{tipo === 'comercial'
							? 'Asignar ejecutivo comercial'
							: 'Asignar ejecutivo de evaluación'}
					</DialogTitle>
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
