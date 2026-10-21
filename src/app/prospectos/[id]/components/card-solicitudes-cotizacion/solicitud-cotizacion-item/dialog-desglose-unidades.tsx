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
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import type Cotizacion from '@/dominio/cotizacion/cotizacion'
import { useGenerarDesgloseUnidades } from '@/hooks/estudio-comercial/use-generar-desglose-unidades'
import { useUfValue } from '@/hooks/uf/use-uf-value'
import { formatUF } from '@/lib/uf'
import { Download, Loader2, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

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
	const [cantidadCuotas, setCantidadCuotas] = useState('11')
	const [valorUf, setValorUf] = useState('')
	const generarMutation = useGenerarDesgloseUnidades()
	const { cargando: cargandoUf, refrescar: fetchUf } = useUfValue()

	const cuotasValidas = Number(cantidadCuotas) > 0
	const ufValido = Number(valorUf) > 0

	const toggleId = (id: number) => {
		setIdsSeleccionados(prev =>
			prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
		)
	}

	const manejarUf = () => {
		fetchUf().then(valor => {
			if (valor != null) setValorUf(String(valor))
		})
	}

	useEffect(() => {
		if (open && !valorUf) manejarUf()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open])

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
			cantidad_cuotas: Number(cantidadCuotas),
			valor_uf: Number(valorUf),
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
						Seleccione las cotizaciones y configure las cuotas para generar el
						Excel con el desglose por unidad: la prima se reparte según el monto
						asegurado de cada unidad.
					</DialogDescription>
				</DialogHeader>

				<div className='max-h-[60vh] space-y-3 overflow-y-auto px-4 py-3'>
					<div className='space-y-2 rounded-md border border-border/70 bg-muted/10 p-2.5'>
						<div className='space-y-1.5'>
							<Label className='text-xs text-muted-foreground'>Cantidad de cuotas</Label>
							<Input
								type='number'
								min={1}
								className='h-8 text-sm shadow-none'
								value={cantidadCuotas}
								onChange={event => setCantidadCuotas(event.target.value)}
							/>
						</div>

						<div className='space-y-1.5'>
							<Label className='text-xs text-muted-foreground'>Valor UF (CLP)</Label>
							<div className='flex items-center gap-1.5'>
								<Input
									type='number'
									min={0}
									className='h-8 text-sm shadow-none'
									placeholder='Valor de la UF'
									value={valorUf}
									onChange={event => setValorUf(event.target.value)}
								/>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-8 px-2 shadow-none'
									onClick={manejarUf}
									disabled={cargandoUf}
									title='Obtener valor UF del indicador'
								>
									<RefreshCw
										className={`size-3.5 ${cargandoUf ? 'animate-spin' : ''}`}
										aria-hidden
									/>
								</Button>
							</div>
						</div>
					</div>

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
							idsSeleccionados.length === 0 ||
							!cuotasValidas ||
							!ufValido ||
							generarMutation.isPending
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
