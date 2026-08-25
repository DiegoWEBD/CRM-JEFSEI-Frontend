'use client'

import { useState } from 'react'
import { useValoresUfRegion } from '@/hooks/configuracion-condominio/use-valores-uf-region'
import { useGuardarValorUfRegion } from '@/hooks/configuracion-condominio/use-guardar-valor-uf-region'
import { useEliminarValorUfRegion } from '@/hooks/configuracion-condominio/use-eliminar-valor-uf-region'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/table'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Skeleton } from '@/components/skeleton'
import { CHILE_REGIONES_NOMBRES } from '@/lib/chile-regiones-comunas'
import { Pencil, Save, Trash2, X } from 'lucide-react'

export default function TablaValoresUfRegion() {
	const { data: valores, isLoading } = useValoresUfRegion()
	const guardarMutation = useGuardarValorUfRegion()
	const eliminarMutation = useEliminarValorUfRegion()

	const [nuevaRegion, setNuevaRegion] = useState('')
	const [nuevoValor, setNuevoValor] = useState('')
	const [editando, setEditando] = useState<number | null>(null)
	const [valorEditado, setValorEditado] = useState('')
	const [eliminarId, setEliminarId] = useState<number | null>(null)

	const regionesOcupadas = valores?.map(v => v.region) ?? []
	const regionesDisponibles = CHILE_REGIONES_NOMBRES.filter(
		r => !regionesOcupadas.includes(r),
	)

	const handleAgregar = () => {
		if (!nuevaRegion.trim() || !nuevoValor.trim()) return

		guardarMutation.mutate(
			{
				region: nuevaRegion.trim(),
				valor_uf_m2: parseFloat(nuevoValor),
			},
			{
				onSuccess: () => {
					setNuevaRegion('')
					setNuevoValor('')
				},
			},
		)
	}

	const handleEditar = (id: number, valorActual: number) => {
		setEditando(id)
		setValorEditado(valorActual.toString())
	}

	const handleCancelarEdicion = () => {
		setEditando(null)
		setValorEditado('')
	}

	const handleGuardar = (id: number) => {
		if (!valorEditado.trim()) return

		const valor = valores?.find(v => v.id === id)
		if (!valor) return

		guardarMutation.mutate(
			{
				id,
				region: valor.region,
				valor_uf_m2: parseFloat(valorEditado),
			},
			{
				onSuccess: () => {
					setEditando(null)
					setValorEditado('')
				},
			},
		)
	}

	const handleConfirmarEliminar = () => {
		if (eliminarId) {
			eliminarMutation.mutate(eliminarId)
			setEliminarId(null)
		}
	}

	const valorAEliminar = valores?.find(v => v.id === eliminarId)

	if (isLoading) {
		return (
			<Card className='border-border bg-card shadow-none'>
				<CardHeader className='border-b border-border pb-2 pt-3'>
					<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
						Valores UF por Región
					</CardTitle>
				</CardHeader>
				<CardContent className='p-4'>
					<div className='space-y-2'>
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className='flex items-center gap-3'>
								<Skeleton className='h-4 flex-1 rounded-md' />
								<Skeleton className='h-4 w-20 rounded-md' />
								<Skeleton className='h-8 w-16 rounded-md' />
								<Skeleton className='h-8 w-8 rounded-md' />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='border-b border-border pb-2 pt-3'>
				<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
					Valores UF por Región
				</CardTitle>
			</CardHeader>
			<CardContent className='p-4'>
				<div className='overflow-x-auto'>
					<Table className='[&_td]:whitespace-nowrap [&_th]:whitespace-nowrap'>
						<TableHeader>
							<TableRow className='border-0 hover:bg-transparent'>
								<TableHead className='h-9 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
									Región
								</TableHead>
								<TableHead className='h-9 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
									Valor UF/m²
								</TableHead>
								<TableHead className='h-9 w-[100px] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
									Acciones
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{valores?.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={3}
										className='px-3 py-8 text-center text-sm text-muted-foreground'
									>
										No hay valores UF registrados. Agrega uno a continuación.
									</TableCell>
								</TableRow>
							) : (
								valores?.map(valor => (
									<TableRow
										key={valor.id}
										className='border-b border-border/60 transition-colors hover:bg-accent/40'
									>
										<TableCell className='px-3 py-2.5 text-sm'>
											{valor.region}
										</TableCell>
										<TableCell className='px-3 py-2.5'>
											{editando === valor.id ? (
												<Input
													type='number'
													step='0.0001'
													value={valorEditado}
													onChange={e => setValorEditado(e.target.value)}
													className='h-8 w-28 text-xs shadow-none'
													autoFocus
												/>
											) : (
												<span className='text-sm font-medium tabular-nums'>
													{valor.valor_uf_m2}
												</span>
											)}
										</TableCell>
										<TableCell className='px-3 py-2.5'>
											<div className='flex items-center gap-1'>
												{editando === valor.id ? (
													<>
														<Button
															size='sm'
															variant='outline'
															className='h-8 w-8 p-0 shadow-none'
															onClick={() => handleGuardar(valor.id)}
															disabled={guardarMutation.isPending}
														>
															<Save className='h-3.5 w-3.5' />
														</Button>
														<Button
															size='sm'
															variant='outline'
															className='h-8 w-8 p-0 shadow-none'
															onClick={handleCancelarEdicion}
														>
															<X className='h-3.5 w-3.5' />
														</Button>
													</>
												) : (
													<>
														<Button
															size='sm'
															variant='outline'
															className='h-8 w-8 p-0 shadow-none'
															onClick={() =>
																handleEditar(valor.id, valor.valor_uf_m2)
															}
														>
															<Pencil className='h-3.5 w-3.5' />
														</Button>
														<Button
															size='sm'
															variant='destructive'
															className='h-8 w-8 p-0 shadow-none'
															onClick={() => setEliminarId(valor.id)}
														>
															<Trash2 className='h-3.5 w-3.5' />
														</Button>
													</>
												)}
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				<div className='mt-4 flex items-end gap-2 border-t border-border pt-4'>
					<div className='flex-1 space-y-1.5'>
						<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
							Región
						</p>
						<Select value={nuevaRegion} onValueChange={setNuevaRegion}>
							<SelectTrigger className='h-9 w-full text-xs shadow-none'>
								<SelectValue placeholder='Seleccionar región' />
							</SelectTrigger>
							<SelectContent className='max-h-70'>
								{regionesDisponibles.map(r => (
									<SelectItem key={r} value={r} className='text-xs'>
										{r}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='w-32 space-y-1.5'>
						<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
							Valor UF/m²
						</p>
						<Input
							type='number'
							step='0.0001'
							placeholder='0.0000'
							value={nuevoValor}
							onChange={e => setNuevoValor(e.target.value)}
							className='h-9 text-xs shadow-none'
						/>
					</div>
					<Button
						onClick={handleAgregar}
						disabled={
							!nuevaRegion.trim() || !nuevoValor.trim() || guardarMutation.isPending
						}
						size='sm'
						className='h-9 text-xs shadow-none'
					>
						Agregar
					</Button>
				</div>
			</CardContent>

			<ConfirmDialog
				open={eliminarId !== null}
				onOpenChange={() => setEliminarId(null)}
				title='¿Eliminar valor UF?'
				description={`Se eliminará el valor UF/m² de "${valorAEliminar?.region ?? ''}". Esta acción no se puede deshacer.`}
				confirmText='Eliminar'
				onConfirm={handleConfirmarEliminar}
				isPending={eliminarMutation.isPending}
			/>
		</Card>
	)
}
