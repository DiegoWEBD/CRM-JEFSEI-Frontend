'use client'

import { Button } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import type Cotizacion from '@/dominio/cotizacion/cotizacion'
import { useGenerarDesgloseUnidades } from '@/hooks/estudio-comercial/use-generar-desglose-unidades'
import { formatUF } from '@/lib/uf'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

type DialogDesgloseUnidadesProps = {
	solicitudId: number
	cotizaciones: Cotizacion[]
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function DialogDesgloseUnidades({
	solicitudId,
	cotizaciones,
	open,
	onOpenChange,
}: DialogDesgloseUnidadesProps) {
	const [idsSeleccionados, setIdsSeleccionados] = useState<number[]>([])
	const generarMutation = useGenerarDesgloseUnidades()

	const toggleId = (id: number) => {
		setIdsSeleccionados(prev =>
			prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
		)
	}

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			setIdsSeleccionados([])
			generarMutation.reset()
		}
		onOpenChange(next)
	}

	const descargar = async () => {
		const blob = await generarMutation.mutateAsync({
			id_solicitud: solicitudId,
			ids_cotizacion: idsSeleccionados,
		})

		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `desglose_unidades_solicitud_${solicitudId}.xlsx`
		a.click()
		URL.revokeObjectURL(url)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-md gap-0 p-0'>
				<DialogHeader className='border-b border-border px-4 py-3 pr-12'>
					<DialogTitle className='text-base'>Desglose por unidad</DialogTitle>
					<DialogDescription>
						Seleccione las cotizaciones para generar el Excel con el desglose
						por unidad según las alícuotas importadas.
					</DialogDescription>
				</DialogHeader>

				<div className='max-h-[60vh] space-y-2 overflow-y-auto px-4 py-3'>
					{cotizaciones.length === 0 ? (
						<p className='rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground'>
							Debe registrar al menos una cotización.
						</p>
					) : (
						cotizaciones.map(cotizacion => {
							const checked = idsSeleccionados.includes(cotizacion.id)

							return (
								<label
									key={cotizacion.id}
									className={`flex cursor-pointer items-start gap-2 rounded-md border p-2.5 text-xs transition-colors ${
										checked
											? 'border-primary/60 bg-primary/5'
											: 'border-border/70 bg-card hover:border-border'
									}`}
								>
									<Checkbox
										checked={checked}
										onCheckedChange={() => toggleId(cotizacion.id)}
										className='mt-0.5'
									/>
									<div className='min-w-0 flex-1 space-y-1'>
										<p className='font-medium text-foreground'>
											{cotizacion.company}
										</p>
										<p className='text-muted-foreground'>
											Monto asegurado: {formatUF(cotizacion.monto_total_asegurado)}
											{' · '}
											Prima bruta: {formatUF(cotizacion.prima_bruta)}
										</p>
									</div>
								</label>
							)
						})
					)}

					{generarMutation.isError ? (
						<p className='text-xs text-destructive'>
							Ocurrió un error al generar el archivo. Intente nuevamente.
						</p>
					) : null}
				</div>

				<DialogFooter className='border-t border-border px-4 py-3'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='h-8 text-xs'
						onClick={() => handleOpenChange(false)}
					>
						Cerrar
					</Button>
					<Button
						type='button'
						size='sm'
						className='h-8 text-xs'
						disabled={
							idsSeleccionados.length === 0 || generarMutation.isPending
						}
						onClick={descargar}
					>
						{generarMutation.isPending ? (
							<Loader2 className='mr-1 size-3 animate-spin' />
						) : (
							<Download className='mr-1 size-3' />
						)}
						Descargar Excel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
