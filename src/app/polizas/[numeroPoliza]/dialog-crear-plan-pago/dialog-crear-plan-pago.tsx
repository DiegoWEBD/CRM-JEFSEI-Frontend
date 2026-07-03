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
import Input from '@/components/forms/input/input'
import { useCrearPlanPago } from '@/hooks/polizas/use-crear-plan-pago'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type DialogCrearPlanPagoProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	numeroPoliza: string
}

export default function DialogCrearPlanPago({
	open,
	onOpenChange,
	numeroPoliza,
}: DialogCrearPlanPagoProps) {
	const mutation = useCrearPlanPago(numeroPoliza)

	const proximoMes = new Date()
	proximoMes.setMonth(proximoMes.getMonth() + 1)
	const fechaSugerida = proximoMes.toISOString().split('T')[0]

	const [numeroCuotas, setNumeroCuotas] = useState(12)
	const [fechaPrimeraCuota, setFechaPrimeraCuota] = useState(fechaSugerida)

	async function handleSubmit() {
		if (!numeroCuotas || !fechaPrimeraCuota) return
		try {
			await mutation.mutateAsync({
				numero_cuotas: numeroCuotas,
				fecha_primera_cuota: fechaPrimeraCuota,
			})
			toast.success('Plan de pago creado exitosamente')
			onOpenChange(false)
		} catch {
			toast.error('Error al crear plan de pago')
		}
	}

	function handleOpenChange(open: boolean) {
		if (!open) {
			setNumeroCuotas(12)
			setFechaPrimeraCuota(fechaSugerida)
		}
		onOpenChange(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-sm gap-4'>
				<DialogHeader>
					<DialogTitle>Crear plan de pago</DialogTitle>
				</DialogHeader>

				<div className='space-y-3'>
					<div className='space-y-1.5'>
						<Label className='text-xs'>Número de cuotas</Label>
						<Input
							type='number'
							min={1}
							value={numeroCuotas}
							onChange={e => setNumeroCuotas(Number(e.target.value))}
						/>
					</div>
					<div className='space-y-1.5'>
						<Label className='text-xs'>Fecha primera cuota</Label>
						<Input
							type='date'
							value={fechaPrimeraCuota}
							onChange={e => setFechaPrimeraCuota(e.target.value)}
						/>
					</div>
				</div>

				{mutation.isError && (
					<p className='text-xs font-medium text-destructive' role='alert'>
						{mutation.error instanceof Error
							? mutation.error.message
							: 'Error al crear plan de pago'}
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
						disabled={!numeroCuotas || !fechaPrimeraCuota || mutation.isPending}
						onClick={handleSubmit}
					>
						{mutation.isPending ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden />
						) : null}
						Crear
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
