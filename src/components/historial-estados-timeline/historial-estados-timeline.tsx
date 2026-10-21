import { HistorialEstadoJson } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/dto/historial-estado-json'
import { Skeleton } from '@/components/skeleton'
import { formatearFecha } from '@/utils/formatear-fecha'

type HistorialEstadosTimelineProps = {
	historial: HistorialEstadoJson[] | undefined
	cargando: boolean
}

export default function HistorialEstadosTimeline({
	historial,
	cargando,
}: HistorialEstadosTimelineProps) {
	return (
		<>
			{cargando && (
				<div className='space-y-3 py-2'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className='flex items-start gap-2'>
							<Skeleton className='mt-1 h-2 w-2 shrink-0 rounded-full' />
							<div className='flex-1 space-y-1.5'>
								<Skeleton className='h-3 w-28' />
								<Skeleton className='h-3 w-44' />
								<Skeleton className='h-3 w-36' />
							</div>
						</div>
					))}
				</div>
			)}

			{historial && historial.length === 0 && (
				<p className='text-xs text-muted-foreground'>
					No hay historial de estados
				</p>
			)}

			{historial && historial.length > 0 && (
				<div className='space-y-3 border-l-2 border-border/50 pl-4'>
					{historial.map((item, idx) => {
						const etapa = item.estado.etapa.nombre
						// La lista viene ordenada de más reciente a más antiguo,
						// por lo que el siguiente elemento es el más antiguo.
						const siguiente = historial[idx + 1]
						const etapaSiguiente = siguiente?.estado.etapa.nombre
						const cambioEtapa =
							siguiente !== undefined && etapaSiguiente !== etapa
						const etapaYaVisitada = historial
							.slice(idx + 1)
							.some(e => e.estado.etapa.nombre === etapa)

						return (
							<div key={idx}>
								<div className='relative'>
									<div className='absolute left-[-1.35rem] top-1.5 h-2 w-2 rounded-full border-2 border-primary bg-background' />
									<div className='flex flex-wrap items-center gap-2'>
										<p className='text-xs font-medium text-foreground'>
											{item.estado.nombre}
										</p>
										<span className='rounded-sm border border-border bg-muted/50 px-1.5 py-0.5 text-xs text-muted-foreground'>
											{etapa}
										</span>
									</div>
									<p className='text-sm text-muted-foreground'>
										Por: {item.registrado_por.nombre}
									</p>
									<p className='text-sm text-muted-foreground tabular-nums'>
										{formatearFecha(
											new Date(item.fecha_registro),
											'dd MMM yyyy, HH:mm',
										)}
									</p>
									{item.observacion && (
										<p className='mt-0.5 text-sm text-muted-foreground/80 italic'>
											{item.observacion}
										</p>
									)}
								</div>

								{cambioEtapa && (
									<div className='relative py-0.5'>
										<div className='absolute left-[-1.35rem] top-1.5 h-2 w-2 rounded-full border-2 border-border bg-background' />
										<p
											className={
												'text-xs font-medium ' +
												(etapaYaVisitada
													? 'text-amber-600 dark:text-amber-500'
													: 'text-muted-foreground')
											}
										>
											{etapaYaVisitada ? (
												<>← Volvió a &quot;{etapa}&quot;</>
											) : (
												<>→ {etapa}</>
											)}
										</p>
									</div>
								)}
							</div>
						)
					})}
				</div>
			)}
		</>
	)
}
