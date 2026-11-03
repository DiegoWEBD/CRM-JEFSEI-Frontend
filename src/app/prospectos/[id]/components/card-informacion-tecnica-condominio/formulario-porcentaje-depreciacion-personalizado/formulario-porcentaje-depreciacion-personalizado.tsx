'use client'

import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import Input from '@/components/forms/input/input'
import Label from '@/components/forms/label/label'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { useActualizarPorcentajeDepreciacionPersonalizado } from '@/hooks/prospectos/use-actualizar-porcentaje-depreciacion-personalizado'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

type DialogPorcentajeDepreciacionPersonalizadoProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	prospecto: ProspectoCondominio
}

export default function DialogPorcentajeDepreciacionPersonalizado({
	open,
	onOpenChange,
	prospecto,
}: DialogPorcentajeDepreciacionPersonalizadoProps) {
	const [valor, setValor] = useState<string>(
		prospecto.porcentaje_depreciacion_personalizado != null
			? (prospecto.porcentaje_depreciacion_personalizado * 100).toString()
			: '',
	)
	const { mutateAsync, isPending } =
		useActualizarPorcentajeDepreciacionPersonalizado(prospecto.id)

	const handleGuardar = async () => {
		const valorNumerico = valor === '' ? null : parseFloat(valor)
		await mutateAsync(valorNumerico)
		onOpenChange(false)
	}

	const handleUsarValorCalculado = async () => {
		await mutateAsync(null)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-base'>
						Porcentaje de depreciación personalizado
					</DialogTitle>
					<DialogDescription>
						Establece un porcentaje de depreciación personalizado para este
						condominio. Si se define, se utilizará en lugar del valor calculado
						por la antigüedad del condominio.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-1.5'>
					<Label className='text-xs'>Porcentaje de depreciación (%)</Label>
					<Input
						name='porcentaje_depreciacion_personalizado'
						type='number'
						step='0.01'
						min='0'
						max='100'
						value={valor}
						onChange={(e) => setValor(e.target.value)}
						placeholder='Ingrese el porcentaje de depreciación personalizado'
						className='h-9 text-sm shadow-none'
					/>
				</div>

				<p className='text-xs text-muted-foreground'>
					{prospecto.porcentaje_depreciacion_personalizado != null
						? 'Actualmente se está usando un porcentaje de depreciación personalizado para este condominio.'
						: 'Si establece un porcentaje, se utilizará en lugar del valor calculado por la antigüedad.'}
				</p>

				<DialogFooter className='gap-2'>
					{prospecto.porcentaje_depreciacion_personalizado != null && (
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-9 text-xs shadow-none'
							onClick={handleUsarValorCalculado}
							disabled={isPending}
						>
							Usar valor calculado
						</Button>
					)}
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='h-9 text-xs shadow-none'
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Cancelar
					</Button>
					<Button
						type='button'
						size='sm'
						className='h-9 text-xs shadow-none'
						onClick={handleGuardar}
						disabled={isPending}
					>
						{isPending && (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden />
						)}
						Guardar cambios
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
