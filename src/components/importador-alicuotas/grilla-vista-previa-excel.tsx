'use client'

import type {
	AnalizarAlicuotasResponse,
	CeldaVistaPrevia,
} from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { Button } from '@/components/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/table'
import { useMemo, useState } from 'react'

const FILAS_INICIALES = 100

export function letraColumna(numero: number): string {
	let letras = ''
	let resto = numero

	while (resto > 0) {
		const posicion = (resto - 1) % 26
		letras = String.fromCharCode(65 + posicion) + letras
		resto = Math.floor((resto - 1) / 26)
	}

	return letras
}

function textoCelda(celda: CeldaVistaPrevia): string {
	if (celda.formula_sin_resultado) return 'fórmula sin resultado'
	if (celda.valor == null) return ''
	if (typeof celda.valor === 'number') return String(celda.valor)
	return String(celda.valor)
}

type GrillaVistaPreviaExcelProps = {
	analisis: AnalizarAlicuotasResponse
	filaEncabezados: number
	primeraFila: number
	ultimaFila: number
	onSeleccionarFila: (fila: number) => void
}

export default function GrillaVistaPreviaExcel({
	analisis,
	filaEncabezados,
	primeraFila,
	ultimaFila,
	onSeleccionarFila,
}: GrillaVistaPreviaExcelProps) {
	const { vista_previa: vistaPrevia } = analisis
	const [filasVisibles, setFilasVisibles] = useState(FILAS_INICIALES)

	const filas = useMemo(() => {
		const numeros: number[] = []
		for (let f = vistaPrevia.fila_desde; f <= vistaPrevia.fila_hasta; f++) {
			numeros.push(f)
		}
		return numeros
	}, [vistaPrevia.fila_desde, vistaPrevia.fila_hasta])

	const columnas = useMemo(() => {
		const numeros: number[] = []
		for (let c = vistaPrevia.columna_desde; c <= vistaPrevia.columna_hasta; c++) {
			numeros.push(c)
		}
		return numeros
	}, [vistaPrevia.columna_desde, vistaPrevia.columna_hasta])

	return (
		<div className='space-y-2'>
			<div className='max-h-72 overflow-auto rounded-md border border-border'>
				<Table className='w-full border-separate border-spacing-0'>
					<TableHeader>
						<TableRow>
							<TableHead className='sticky left-0 top-0 z-10 w-12 border-b border-border bg-muted/60 px-2 py-1.5 text-center text-[10px] font-medium text-muted-foreground'>
								#
							</TableHead>
							{columnas.map(columna => (
								<TableHead
									key={columna}
									className='sticky top-0 z-10 min-w-24 border-b border-border bg-muted/60 px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground'
								>
									{letraColumna(columna)}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{filas.slice(0, filasVisibles).map(fila => {
							const indiceFila = fila - vistaPrevia.fila_desde
							const esEncabezado = fila === filaEncabezados
							const estaEnRango = fila >= primeraFila && fila <= ultimaFila

							return (
								<TableRow
									key={fila}
									onClick={() => onSeleccionarFila(fila)}
									className={`cursor-pointer ${
										esEncabezado
											? 'bg-primary/10 font-medium'
											: estaEnRango
												? 'bg-success/5'
												: 'opacity-60'
									}`}
								>
									<TableCell className='sticky left-0 z-10 border-b border-border/60 bg-background px-2 py-1 text-center text-xs text-muted-foreground'>
										{fila}
									</TableCell>
									{columnas.map(columna => {
										const indiceColumna = columna - vistaPrevia.columna_desde
										const celda = vistaPrevia.celdas[indiceFila]?.[indiceColumna]
										return (
											<TableCell
												key={columna}
												title={celda?.formula_sin_resultado ? 'Fórmula sin resultado calculado' : undefined}
												className={`max-w-48 truncate border-b border-border/60 px-2 py-1 text-xs ${
													celda?.formula_sin_resultado ? 'text-warning' : 'text-foreground'
												}`}
											>
												{celda ? textoCelda(celda) : ''}
											</TableCell>
										)
									})}
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</div>

			{filas.length > filasVisibles && (
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-8 text-xs shadow-none'
					onClick={() => setFilasVisibles(cantidad => cantidad + FILAS_INICIALES)}
				>
					Mostrar más filas ({filasVisibles} de {filas.length})
				</Button>
			)}
		</div>
	)
}
