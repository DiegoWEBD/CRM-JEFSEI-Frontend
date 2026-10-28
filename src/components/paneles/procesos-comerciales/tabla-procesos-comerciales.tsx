'use client'

import type { ReporteProcesoComercial } from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import { Badge } from '@/components/badge'
import { BadgeEstadoOportunidad } from '@/components/badge/badge-estado-oportunidad/badge-estado-oportunidad'
import { Card, CardContent } from '@/components/card'
import Paginacion from '@/components/paginacion/paginacion'
import { SEMAFORO_VARIANT } from '@/lib/badge-variants'
import { cn } from '@/lib/utils'
import { SkeletonTabla } from './skeleton-tabla'

const PRIORIDAD_ORDER: Record<string, number> = {
	ROJO: 0,
	AMARILLO: 1,
	VERDE: 2,
	NO_APLICA: 3,
}

const PRIORIDAD_DOT: Record<string, string> = {
	ROJO: 'bg-destructive',
	AMARILLO: 'bg-warning',
	VERDE: 'bg-success',
	NO_APLICA: 'bg-muted-foreground/40',
}

const PRIORIDAD_LABELS: Record<string, string> = {
	ROJO: 'Atrasado',
	AMARILLO: 'En riesgo',
	VERDE: 'En plazo',
	NO_APLICA: '—',
}

type TablaProcesosComercialesProps = {
	filas: ReporteProcesoComercial[]
	isFetching: boolean
	onSeleccionar: (fila: ReporteProcesoComercial) => void
	pagina: number
	totalPaginas: number
	onPaginaChange: (pagina: number) => void
}

export default function TablaProcesosComerciales({
	filas,
	isFetching,
	onSeleccionar,
	pagina,
	totalPaginas,
	onPaginaChange,
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
			{/* Mobile: cards */}
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
											PRIORIDAD_DOT[f.estado_semaforo],
										)}
									/>
									<div className='min-w-0'>
										<p className='truncate text-sm font-semibold text-foreground'>
											{f.proceso.nombre_cliente}
										</p>
										<div className='flex items-center gap-1.5 min-w-0'>
											<p className='truncate text-xs text-muted-foreground'>
												{f.proceso.producto}
											</p>
											{f.proceso.renovacion ? (
												<Badge
													variant='pastel-indigo'
													className='shrink-0 text-[10px]'
												>
													Renovación
												</Badge>
											) : null}
										</div>
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
									<BadgeEstadoOportunidad estado={f.proceso.estado_actual} />
								</span>
								{!f.proceso.cerrado && (
									<>
										<span>
											Tiempo: {f.dias_transcurridos ?? '—'} /{' '}
											{f.dias_limite ?? '—'} días
										</span>
										<span>
											SLA:{' '}
											{f.porentaje_sla_consumido != null
												? `${(f.porentaje_sla_consumido * 100).toFixed(0)}%`
												: '—'}
										</span>
									</>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Desktop: tabla densa */}
			<div className='hidden lg:block'>
				<div className='overflow-x-auto rounded-lg border border-border'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-border bg-muted/40'>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Cliente
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Ejecutivo
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Etapa
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Estado
								</th>
								<th className='px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									SLA
								</th>
								<th className='px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Semáforo
								</th>
							</tr>
						</thead>
						<tbody>
							{ordenadas.map((f, i) => (
								<tr
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
									className='cursor-pointer border-b border-border/50 transition-colors hover:bg-accent/50 last:border-b-0'
								>
									<td className='px-4 py-2.5'>
										<p className='font-semibold text-foreground truncate max-w-50'>
											{f.proceso.nombre_cliente}
										</p>
										<div className='flex items-center gap-1.5 min-w-0'>
											<p className='text-xs text-muted-foreground truncate max-w-50'>
												{f.proceso.producto}
											</p>
											{f.proceso.renovacion ? (
												<Badge
													variant='pastel-indigo'
													className='shrink-0 text-[10px]'
												>
													Renovación
												</Badge>
											) : null}
										</div>
									</td>
									<td className='px-4 py-2.5 text-xs text-foreground truncate max-w-35'>
										{f.proceso.ejecutivo_comercial?.nombre ?? '—'}
									</td>
									<td className='px-4 py-2.5 text-xs text-foreground truncate max-w-30'>
										{f.proceso.etapa_actual.nombre}
									</td>
									<td className='px-4 py-2.5'>
										<BadgeEstadoOportunidad estado={f.proceso.estado_actual} />
									</td>
									<td className='px-4 py-2.5 text-right'>
										{!f.proceso.cerrado && f.porentaje_sla_consumido != null ? (
											<Badge
												variant={SEMAFORO_VARIANT[f.estado_semaforo]}
												className='text-[11px] font-medium tabular-nums'
											>
												{(f.porentaje_sla_consumido * 100).toFixed(0)}%
											</Badge>
										) : (
											<span className='text-xs text-muted-foreground'>—</span>
										)}
									</td>
									<td className='px-4 py-2.5'>
										<div className='flex justify-center'>
											<Badge
												variant={SEMAFORO_VARIANT[f.estado_semaforo]}
												className='text-[11px] font-medium'
											>
												{PRIORIDAD_LABELS[f.estado_semaforo]}
											</Badge>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<Paginacion
				pagina={pagina}
				totalPaginas={totalPaginas}
				onPaginaChange={onPaginaChange}
			/>
		</>
	)
}
