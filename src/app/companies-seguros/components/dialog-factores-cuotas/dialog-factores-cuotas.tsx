'use client'

import type {
	FactorCuotaRequest,
} from '@/aplicacion/companies-seguros/use-cases/actualizar-factores-cuotas'
import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import CompanySeguro from '@/dominio/company-seguro/company-seguro'
import { useActualizarFactoresCuotas } from '@/hooks/companies-seguros/use-actualizar-factores-cuotas'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

type DialogFactoresCuotasProps = {
	company: CompanySeguro
	cerrarDialog: () => void
}

type FilaFactor = {
	numero_cuotas: number | ''
	factor: number | ''
}

const vacio = (): FilaFactor => ({ numero_cuotas: '', factor: '' })

/**
 * El componente se monta por compañía (la clave en el padre hace el reset),
 * así que el estado inicial se deriva de las props sin efectos secundarios.
 */
function filasIniciales(company: CompanySeguro): FilaFactor[] {
	if (company.factores_cuotas.length === 0) return [vacio()]

	return company.factores_cuotas.map(f => ({
		numero_cuotas: f.numero_cuotas,
		factor: f.factor,
	}))
}

export default function DialogFactoresCuotas({
	company,
	cerrarDialog,
}: DialogFactoresCuotasProps) {
	const factoresMutation = useActualizarFactoresCuotas()
	const [filas, setFilas] = useState<FilaFactor[]>(() =>
		filasIniciales(company),
	)
	const [error, setError] = useState<string | null>(null)

	const agregarFila = () => setFilas(prev => [...prev, vacio()])

	const quitarFila = (indice: number) =>
		setFilas(prev => prev.filter((_, i) => i !== indice))

	const actualizarFila = (
		indice: number,
		campo: 'numero_cuotas' | 'factor',
		valor: string,
	) => {
		setFilas(prev =>
			prev.map((fila, i) =>
				i === indice
					? { ...fila, [campo]: valor === '' ? '' : Number(valor) }
					: fila,
			),
		)
		setError(null)
	}

	const validar = (): FactorCuotaRequest[] | null => {
		const usadas = new Set<number>()

		for (const fila of filas) {
			const vacia =
				fila.numero_cuotas === '' && fila.factor === ''
			if (vacia) continue

			if (
				typeof fila.numero_cuotas !== 'number' ||
				!Number.isInteger(fila.numero_cuotas) ||
				fila.numero_cuotas < 1
			) {
				setError('El número de cuotas debe ser un entero mayor a 0')
				return null
			}

			if (typeof fila.factor !== 'number' || fila.factor <= 0) {
				setError('El factor debe ser mayor a 0')
				return null
			}

			if (usadas.has(fila.numero_cuotas)) {
				setError('Número de cuotas duplicado')
				return null
			}

			usadas.add(fila.numero_cuotas)
		}

		return filas
			.filter(f => f.numero_cuotas !== '' && f.factor !== '')
			.map(f => ({
				numero_cuotas: f.numero_cuotas as number,
				factor: f.factor as number,
			}))
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		const factores = validar()
		if (factores === null) return

		try {
			await factoresMutation.mutateAsync({ id: company.id, factores })
			cerrarDialog()
		} catch {
			// El error ya se notifica globalmente (MutationCache onError).
		}
	}

	return (
		<Dialog
			open
			onOpenChange={open => {
				if (!open) cerrarDialog()
			}}
		>
			<DialogContent>
				<DialogTitle>Factores de cuotas</DialogTitle>
				<DialogDescription>
					Define los factores aplicables a {company.nombre} según el número de
					cuotas. Deja una fila vacía para descartarla.
				</DialogDescription>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-3'>
						<div className='grid grid-cols-[1fr_1fr_auto] gap-2'>
							<Label>Cuotas</Label>
							<Label>Factor</Label>
							<span />
						</div>

						{filas.map((fila, indice) => (
							<div
								key={indice}
								className='grid grid-cols-[1fr_1fr_auto] items-center gap-2'
							>
								<Input
									type='number'
									min={1}
									step={1}
									value={fila.numero_cuotas}
									onChange={e =>
										actualizarFila(indice, 'numero_cuotas', e.target.value)
									}
									placeholder='12'
									aria-label='Número de cuotas'
								/>
								<Input
									type='number'
									min={0}
									step='any'
									value={fila.factor}
									onChange={e =>
										actualizarFila(indice, 'factor', e.target.value)
									}
									placeholder='1.0855'
									aria-label='Factor'
								/>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									className='size-9 text-destructive hover:text-destructive'
									title='Quitar fila'
									onClick={() => quitarFila(indice)}
								>
									<Trash2 className='size-4' />
								</Button>
							</div>
						))}

						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={agregarFila}
						>
							<Plus className='size-4' />
							Agregar fila
						</Button>
					</div>

					{error && <p className='text-xs text-destructive'>{error}</p>}

					<div className='flex justify-end gap-2'>
						<Button type='button' variant='outline' onClick={cerrarDialog}>
							Cancelar
						</Button>
						<Button type='submit' disabled={factoresMutation.isPending}>
							{factoresMutation.isPending ? 'Guardando...' : 'Guardar factores'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
