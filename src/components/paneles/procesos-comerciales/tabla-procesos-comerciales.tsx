'use client'

import type {
	ReporteProcesoComercial,
	ReporteProcesoComercialAbierto,
} from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/table'
import { Badge } from '@/components/badge'
import { Card, CardContent } from '@/components/card'
import { SkeletonTabla } from './skeleton-tabla'
import { cn } from '@/lib/utils'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'
import { SEMAFORO_VARIANT } from '@/lib/badge-variants'

const PRIORIDAD_ORDER: Record<string, number> = {
	ROJO: 0,
	AMARILLO: 1,
	VERDE: 2,
	NO_APLICA: 3,
}

const PRIORIDAD_COLORS: Record<string, string> = {
	ROJO: 'bg-destructive',
	AMARILLO: 'bg-warning',
	VERDE: 'bg-success',
	NO_APLICA: 'bg-muted-foreground/40',
}

const PRIORIDAD_LABELS: Record<string, string> = {
	ROJO: 'Atrasado',
	AMARILLO: 'En riesgo',
	VERDE: 'En plazo',
	NO_APLICA: 'â€”',
}

const headClass =
	'h-9 border-b border-border/50 bg-muted/40 px-3 py-2 text-left text-sm font-medium uppercase tracking-wide text-muted-foreground'

const cellClass = 'px-3 py-2.5 align-middle text-sm'

function esAbierto(
	r: ReporteProcesoComercial,
): r is ReporteProcesoComercialAbierto {
	return 'dias_transcurridos' in r
}

type TablaProcesosComercialesProps = {
	filas: ReporteProcesoComercial[]
	isFetching: boolean
	onSeleccionar: (fila: ReporteProcesoComercial) => void
}

export default function TablaProcesosComerciales({
	filas,
	isFetching,
	onSeleccionar,
}: TablaProcesosComercialesProps) {
	if (isFetching) {
		return <SkeletonTabla />
	}

	if (filas.length === 0) {
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					No hay registros que coincidan con los filtros.
				</p>
			</div>
		)
	}

	const ordenadas = [...filas].sort(
		(a, b) =>
			(PRIORIDAD_ORDER[a.estado_semaforo] ?? 99) -
			(PRIORIDAD_ORDER[b.estado_semaforo] ?? 99),
	)

	return (
		<>
			<div className='space-y-3 lg:hidden'>
				{ordenadas.map((f, i) => (
					<Card
						key={`${f.proceso.id}-${i}`}
						role='button'
						tabIndex={0}
						onClick={() => onSeleccionar(f)}
						onKeyDown={e => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault()
								onSeleccionar(f)
							}
						}}
						className='cursor-pointer border-border bg-card shadow-none transition-colors hover:border-primary/40 hover:shadow-sm'
					>
						<CardContent className='p-4'>
							<div className='flex items-start justify-between gap-2'>
								<div className='flex items-center gap-2 min-w-0'>
									<span
										className={cn(
											'mt-0.5 h-3 w-3 shrink-0 rounded-full',
											PRIORIDAD_COLORS[f.estado_semaforo],
										)}
									/>
									<div className='min-w-0'>
										<p className='truncate text-sm font-semibold text-foreground'>
											{f.proceso.nombre_cliente}
										</p>
										<p className='truncate text-xs text-muted-foreground'>
											{f.proceso.producto}
										</p>
									</div>
								</div>
								<Badge
									variant={SEMAFORO_VARIANT[f.estado_semaforo]}
									className='text-xs font-medium'
								>
									{PRIORIDAD_LABELS[f.estado_semaforo]}
								</Badge>
							</div>

							<div className='mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-muted-foreground'>
								<span>Etapa: {f.proceso.etapa_actual.nombre}</span>
								<span>
									Estado:{' '}
									<Badge
										variant='outline'
										className={cn(
											'text-xs font-medium',
											ESTADO_COMERCIAL_BADGE[
												f.proceso.estado_actual
													.codigo as keyof typeof ESTADO_COMERCIAL_BADGE
											] ?? 'border-border bg-muted/50 text-muted-foreground',
										)}
									>
										{ESTADO_PROSPECTO_LABELS[
											f.proceso.estado_actual
												.codigo as keyof typeof ESTADO_PROSPECTO_LABELS
										] ?? f.proceso.estado_actual.nombre}
									</Badge>
								</span>
								{esAbierto(f) && (
									<>
										<span>
											Tiempo: {f.dias_transcurridos} /{' '}
											{f.proceso.etapa_actual.dias_limite ?? 'â€”'} dÃ­as
										</span>
										<span>
											SLA: {(f.porentaje_sla_consumido * 100).toFixed(0)}%
										</span>
									</>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className='hidden max-h-[65vh] overflow-y-auto lg:block'>
				<Table className='min-w-[1200px] w-full border-separate border-spacing-0'>
					<TableHeader className='sticky top-0 z-10 bg-background'>
						<TableRow className='border-0 hover:bg-transparent'>
							<TableHead className={cn(headClass, 'w-10')}>
								<span className='sr-only'>Prioridad</span>
								<span
									aria-hidden
									className='inline-block h-3 w-3 rounded-full bg-current opacity-30'
								/>
							</TableHead>
							<TableHead className={cn(headClass, 'w-[20%]')}>
								Cliente
							</TableHead>
							<TableHead className={cn(headClass, 'w-[11%]')}>
								Producto
							</TableHead>
							<TableHead className={cn(headClass, 'w-[11%]')}>
								Ejecutivo
							</TableHead>
							<TableHead className={cn(headClass, 'w-[9%]')}>Etapa</TableHead>
							<TableHead className={cn(headClass, 'w-[9%]')}>Estado</TableHead>
							<TableHead className={cn(headClass, 'w-[9%]')}>
								Tiempo etapa
							</TableHead>
							<TableHead className={cn(headClass, 'w-16')}>
								SLA lÃ­mite
							</TableHead>
							<TableHead className={cn(headClass, 'w-16')}>% SLA</TableHead>
							<TableHead className={cn(headClass, 'w-[18%]')}>
								Mensaje
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{ordenadas.map((f, i) => (
							<TableRow
								key={`${f.proceso.id}-${i}`}
								role='button'
								tabIndex={0}
								onClick={() => onSeleccionar(f)}
								onKeyDown={e => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										onSeleccionar(f)
									}
								}}
								className='cursor-pointer border-0 border-b border-border/60 transition-colors last:border-b-0 hover:bg-accent/40'
							>
								<TableCell className={cn(cellClass, 'p-1.5 text-center')}>
									<span
										className={cn(
											'inline-block h-3 w-3 rounded-full',
											PRIORIDAD_COLORS[f.estado_semaforo],
										)}
									/>
								</TableCell>
								<TableCell
									className={cn(cellClass, 'font-medium text-foreground')}
								>
									<span className='break-words text-xs leading-snug'>
										{f.proceso.nombre_cliente}
									</span>
								</TableCell>
								<TableCell
									className={cn(cellClass, 'text-sm text-muted-foreground')}
								>
									<span className='line-clamp-2 leading-snug'>
										{f.proceso.producto}
									</span>
								</TableCell>
								<TableCell
									className={cn(cellClass, 'text-sm text-muted-foreground')}
								>
									{f.proceso.ejecutivo_comercial?.nombre ?? 'â€”'}
								</TableCell>
								<TableCell
									className={cn(cellClass, 'text-sm text-muted-foreground')}
								>
									{f.proceso.etapa_actual.nombre}
								</TableCell>
								<TableCell className={cn(cellClass, 'p-1.5')}>
									<Badge
										variant='outline'
										className={cn(
											'text-xs font-medium',
											ESTADO_COMERCIAL_BADGE[
												f.proceso.estado_actual
													.codigo as keyof typeof ESTADO_COMERCIAL_BADGE
											] ?? 'border-border bg-muted/50 text-muted-foreground',
										)}
									>
										{ESTADO_PROSPECTO_LABELS[
											f.proceso.estado_actual
												.codigo as keyof typeof ESTADO_PROSPECTO_LABELS
										] ?? f.proceso.estado_actual.nombre}
									</Badge>
								</TableCell>
								<TableCell
									className={cn(
										cellClass,
										'text-sm tabular-nums text-muted-foreground',
									)}
								>
									{esAbierto(f) ? `${f.dias_transcurridos} dÃ­as` : 'â€”'}
								</TableCell>
								<TableCell
									className={cn(
										cellClass,
										'text-sm tabular-nums text-muted-foreground',
									)}
								>
									{esAbierto(f) && f.proceso.etapa_actual.dias_limite != null
										? `${f.proceso.etapa_actual.dias_limite} dÃ­as`
										: 'â€”'}
								</TableCell>
								<TableCell className={cn(cellClass, 'p-1.5')}>
									{esAbierto(f) ? (
										<Badge
											variant={SEMAFORO_VARIANT[f.estado_semaforo]}
											className='text-xs font-medium tabular-nums'
										>
											{(f.porentaje_sla_consumido * 100).toFixed(0)}%
										</Badge>
									) : (
										<span className='text-xs text-muted-foreground'>â€”</span>
									)}
								</TableCell>
								<TableCell
									className={cn(cellClass, 'text-sm text-muted-foreground')}
								>
									<span className='line-clamp-2 leading-snug'>
										{esAbierto(f) ? f.mensaje_semaforo : 'â€”'}
									</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	)
}
