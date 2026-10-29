'use client'

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/alert-dialog'
import { Button } from '@/components/button'
import { Label } from '@/components/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { useLineasNegocio } from '@/hooks/lineas-negocio/use-lineas-negocio'
import { useObtenerProcesosComerciales } from '@/hooks/procesos-comerciales/use-obtener-procesos-comerciales'
import { useCambiarLineaNegocio } from '@/hooks/prospectos/use-cambiar-linea-negocio'
import { useState } from 'react'
import { toast } from 'sonner'

type DialogCambiarLineaNegocioProps = {
	prospecto: Prospecto
}

export default function DialogCambiarLineaNegocio({
	prospecto,
}: DialogCambiarLineaNegocioProps) {
	const [open, setOpen] = useState(false)
	const [idLineaSeleccionada, setIdLineaSeleccionada] = useState('')

	const { data: lineasNegocio, isLoading: cargandoLineas } = useLineasNegocio()
	const { data: oportunidadesAbiertas, isLoading: cargandoOportunidades } =
		useObtenerProcesosComerciales(prospecto.id, true)
	const cambiarLineaMutation = useCambiarLineaNegocio(prospecto.id)

	const lineasDisponibles = (lineasNegocio ?? []).filter(
		linea => linea.id !== prospecto.linea_negocio.id,
	)
	const cantidadOportunidades = oportunidadesAbiertas?.length ?? 0

	const confirmarCambio = async () => {
		if (!idLineaSeleccionada) return
		try {
			const response = await cambiarLineaMutation.mutateAsync({
				id_linea_negocio: Number(idLineaSeleccionada),
			})
			if (response.oportunidades_descartadas > 0) {
				toast.success(
					`Línea de negocio cambiada. Se descartaron ${response.oportunidades_descartadas} oportunidades abiertas`,
				)
			} else {
				toast.success('Línea de negocio cambiada exitosamente')
			}
			setIdLineaSeleccionada('')
			setOpen(false)
		} catch {
			toast.error('Error cambiando la línea de negocio')
		}
	}

	return (
		<>
			<Button
				type='button'
				variant='outline'
				size='sm'
				className='h-8 text-xs'
				onClick={() => setOpen(true)}
			>
				Cambiar línea de negocio
			</Button>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Cambiar línea de negocio?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción es irreversible. Al cambiar la línea de negocio del
							prospecto
							{cantidadOportunidades > 0
								? `, se descartará${
										cantidadOportunidades === 1 ? '' : 'n'
									} de forma permanente ${cantidadOportunidades} ${
										cantidadOportunidades === 1
											? 'oportunidad abierta'
											: 'oportunidades abiertas'
									}`
								: ' no se descartará ninguna oportunidad (no tiene abiertas)'}
							.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<div className='space-y-1'>
						<Label className='text-xs text-muted-foreground'>
							Nueva línea de negocio
						</Label>
						<Select
							value={idLineaSeleccionada}
							onValueChange={setIdLineaSeleccionada}
						>
							<SelectTrigger className='h-8 w-full text-xs shadow-none'>
								<SelectValue placeholder='Seleccione una línea de negocio' />
							</SelectTrigger>
							<SelectContent>
								{lineasDisponibles.map(linea => (
									<SelectItem key={linea.id} value={String(linea.id)}>
										{linea.nombre}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{!cargandoOportunidades && cantidadOportunidades > 0 && (
						<div className='space-y-1'>
							<Label className='text-xs text-muted-foreground'>
								Oportunidades que se descartarán ({cantidadOportunidades})
							</Label>
							<ul className='max-h-32 space-y-1 overflow-y-auto rounded-md border border-border p-2 text-xs text-muted-foreground'>
								{oportunidadesAbiertas?.map(oportunidad => (
									<li key={oportunidad.id}>
										{oportunidad.producto}
										{oportunidad.nombre_cliente
											? ` — ${oportunidad.nombre_cliente}`
											: ''}
									</li>
								))}
							</ul>
						</div>
					)}

					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<Button
							variant='destructive'
							disabled={
								!idLineaSeleccionada ||
								cargandoLineas ||
								cambiarLineaMutation.isPending
							}
							onClick={confirmarCambio}
						>
							{cambiarLineaMutation.isPending
								? 'Cambiando...'
								: 'Confirmar cambio de línea'}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
