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
import { useActualizarValorUfM2Personalizado } from '@/hooks/prospectos/use-actualizar-valor-uf-m2-personalizado'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

type DialogValorUfM2PersonalizadoProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	prospecto: ProspectoCondominio
}

export default function DialogValorUfM2Personalizado({
	open,
	onOpenChange,
	prospecto,
}: DialogValorUfM2PersonalizadoProps) {
	const [valor, setValor] = useState<string>(
		prospecto.valor_uf_m2_personalizado?.toString() ?? '',
	)
	const { mutateAsync, isPending } = useActualizarValorUfM2Personalizado(prospecto.id)

	const handleGuardar = async () => {
		const valorNumerico = valor === '' ? null : parseFloat(valor)
		await mutateAsync(valorNumerico)
		onOpenChange(false)
	}

	const handleUsarValorRegion = async () => {
		await mutateAsync(null)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-base'>Valor UF / m² personalizado</DialogTitle>
					<DialogDescription>
						Establece un valor UF/m² personalizado para este condominio. Si se define, se utilizará en lugar del valor de la región.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-1.5'>
					<Label className='text-xs'>Valor UF / m² (sin IVA)</Label>
					<Input
						name='valor_uf_m2_personalizado'
						type='number'
						step='0.01'
						value={valor}
						onChange={(e) => setValor(e.target.value)}
						placeholder='Ingrese el valor UF/m² personalizado'
						className='h-9 text-sm shadow-none'
					/>
				</div>

				<p className='text-xs text-muted-foreground'>
					{prospecto.valor_uf_m2_personalizado != null
						? 'Actualmente se está usando un valor UF/m² personalizado para este condominio.'
						: 'Si establece un valor, se utilizará en lugar del valor de la región.'}
				</p>

				<DialogFooter className='gap-2'>
					{prospecto.valor_uf_m2_personalizado != null && (
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-9 text-xs shadow-none'
							onClick={handleUsarValorRegion}
							disabled={isPending}
						>
							Usar valor de región
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
