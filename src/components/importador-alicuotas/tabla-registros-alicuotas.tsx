'use client'

import type {
	ProblemaAlicuota,
	RegistroAlicuota,
} from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/table'
import { formatearProrrateoPorcentaje } from '@/utils/formatear-prorrateo'

const ESTADO_LABELS: Record<RegistroAlicuota['estado'], string> = {
	valido: 'Válido',
	error: 'Error',
	pendiente: 'Pendiente',
}

function claseEstado(estado: RegistroAlicuota['estado']): string {
	if (estado === 'valido') return 'bg-success/10 text-success'
	if (estado === 'error') return 'bg-destructive/10 text-destructive'
	return 'bg-warning/10 text-warning'
}

function textoProrrateo(registro: RegistroAlicuota): string {
	if (registro.prorrateo != null) return formatearProrrateoPorcentaje(registro.prorrateo)
	if (registro.prorrateo_original != null) return String(registro.prorrateo_original)
	return '—'
}

type TablaRegistrosAlicuotasProps = {
	registros: RegistroAlicuota[]
	problemas: ProblemaAlicuota[]
	filasExcluidas: number[]
}

export default function TablaRegistrosAlicuotas({
	registros,
	problemas,
	filasExcluidas,
}: TablaRegistrosAlicuotasProps) {
	return (
		<div className='space-y-3'>
			<div className='max-h-80 overflow-auto rounded-md border border-border'>
				<Table className='w-full border-separate border-spacing-0'>
					<TableHeader>
						<TableRow>
							<TableHead className='border-b border-border bg-muted/60 px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground'>
								Fila
							</TableHead>
							<TableHead className='border-b border-border bg-muted/60 px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground'>
								Unidad
							</TableHead>
							<TableHead className='border-b border-border bg-muted/60 px-2 py-1.5 text-right text-[10px] font-medium text-muted-foreground'>
								Prorrateo
							</TableHead>
							<TableHead className='border-b border-border bg-muted/60 px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground'>
								Estado
							</TableHead>
							<TableHead className='border-b border-border bg-muted/60 px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground'>
								Observación
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{registros.map(registro => (
							<TableRow key={registro.fila_origen}>
								<TableCell className='border-b border-border/60 px-2 py-1 text-xs text-muted-foreground'>
									{registro.fila_origen}
								</TableCell>
								<TableCell className='border-b border-border/60 px-2 py-1 text-xs font-medium text-foreground'>
									{registro.identificador_unidad || '—'}
								</TableCell>
								<TableCell className='border-b border-border/60 px-2 py-1 text-right text-xs text-foreground'>
									{textoProrrateo(registro)}
								</TableCell>
								<TableCell className='border-b border-border/60 px-2 py-1'>
									<span
										className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${claseEstado(registro.estado)}`}
									>
										{ESTADO_LABELS[registro.estado]}
									</span>
								</TableCell>
								<TableCell className='border-b border-border/60 px-2 py-1 text-xs text-muted-foreground'>
									{registro.problemas.map(problema => problema.mensaje).join(' · ') || '—'}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{(problemas.length > 0 || filasExcluidas.length > 0) && (
				<div className='space-y-1 rounded-md border border-destructive/30 bg-destructive/5 p-3'>
					<p className='text-xs font-medium text-destructive'>Problemas detectados</p>
					<ul className='space-y-0.5'>
						{problemas.slice(0, 20).map((problema, indice) => (
							<li key={indice} className='text-xs text-destructive/90'>
								{problema.fila_origen != null ? `Fila ${problema.fila_origen}: ` : ''}
								{problema.mensaje}
							</li>
						))}
					</ul>
					{problemas.length > 20 && (
						<p className='text-xs text-muted-foreground'>
							…y {problemas.length - 20} problemas más.
						</p>
					)}
				</div>
			)}
		</div>
	)
}
