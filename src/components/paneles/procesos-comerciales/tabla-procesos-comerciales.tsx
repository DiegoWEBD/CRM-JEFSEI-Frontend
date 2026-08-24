'use client'

import type {
	ReporteProcesoComercial,
	ReporteProcesoComercialAbierto,
} from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { Badge } from '@/components/badge'
import { Card, CardContent } from '@/components/card'
import Paginacion from '@/components/paginacion/paginacion'
import { SEMAFORO_VARIANT } from '@/lib/badge-variants'
import { cn } from '@/lib/utils'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'
import { SkeletonTabla } from './skeleton-tabla'

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
	NO_APLICA: '—',
}

function esAbierto(
	r: ReporteProcesoComercial,
): r is ReporteProcesoComercialAbierto {
	return 'dias_transcurridos' in r
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
										variant={
											ESTADO_COMERCIAL_BADGE[
												f.proceso.estado_actual
													.codigo as keyof typeof ESTADO_COMERCIAL_BADGE
											] ?? 'outline'
										}
										className='shrink-0 font-semibold text-xs'
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
											{f.proceso.etapa_actual.dias_limite ?? '—'} días
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

			<div className='hidden lg:block space-y-3'>
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
						<CardContent className='px-5 py-2.5'>
							<div className='flex items-center gap-6'>
								<div className='flex-1 min-w-0 space-y-1'>
									<p className='text-sm font-semibold text-foreground truncate'>
										{f.proceso.nombre_cliente}
										<span className='font-normal text-muted-foreground'>
											{' '}
											— {f.proceso.producto}
										</span>
									</p>

									<div className='grid grid-cols-4 gap-x-4'>
										<div className='flex flex-col gap-px'>
											<span className='text-[11px] text-muted-foreground'>
												Ejecutivo
											</span>
											<span className='text-xs text-foreground truncate'>
												{f.proceso.ejecutivo_comercial?.nombre ?? '—'}
											</span>
										</div>
										<div className='flex flex-col gap-px'>
											<span className='text-[11px] text-muted-foreground'>
												Etapa
											</span>
											<span className='text-xs text-foreground truncate'>
												{f.proceso.etapa_actual.nombre}
											</span>
										</div>
										<div className='flex flex-col gap-px'>
											<span className='text-[11px] text-muted-foreground'>
												Tiempo etapa
											</span>
											<span className='text-xs tabular-nums text-foreground'>
												{esAbierto(f)
													? `${f.dias_transcurridos} / ${f.proceso.etapa_actual.dias_limite ?? '—'} días`
													: '—'}
											</span>
										</div>
										<div className='flex flex-col gap-px'>
											<span className='text-[11px] text-muted-foreground'>
												SLA límite
											</span>
											<span className='text-xs tabular-nums text-foreground'>
												{esAbierto(f) && f.proceso.etapa_actual.dias_limite != null
													? `${f.proceso.etapa_actual.dias_limite} días`
													: '—'}
											</span>
										</div>
									</div>
								</div>

								<div className='flex flex-col items-end justify-center gap-1 shrink-0'>
									<Badge
										variant={
											ESTADO_COMERCIAL_BADGE[
												f.proceso.estado_actual
													.codigo as keyof typeof ESTADO_COMERCIAL_BADGE
											] ?? 'outline'
										}
										className='font-semibold text-[11px]'
									>
										{ESTADO_PROSPECTO_LABELS[
											f.proceso.estado_actual
												.codigo as keyof typeof ESTADO_PROSPECTO_LABELS
										] ?? f.proceso.estado_actual.nombre}
									</Badge>
									<Badge
										variant={SEMAFORO_VARIANT[f.estado_semaforo]}
										className='text-[11px] font-medium'
									>
										{PRIORIDAD_LABELS[f.estado_semaforo]}
									</Badge>
									{esAbierto(f) ? (
										<Badge
											variant={SEMAFORO_VARIANT[f.estado_semaforo]}
											className='text-[11px] font-medium tabular-nums'
										>
											{(f.porentaje_sla_consumido * 100).toFixed(0)}%
										</Badge>
									) : (
										<span className='text-[11px] text-muted-foreground'>—</span>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Paginacion
				pagina={pagina}
				totalPaginas={totalPaginas}
				onPaginaChange={onPaginaChange}
			/>
		</>
	)
}
