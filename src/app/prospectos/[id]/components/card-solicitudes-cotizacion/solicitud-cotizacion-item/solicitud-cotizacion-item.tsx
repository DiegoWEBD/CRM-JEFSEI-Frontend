import { PRIORIDAD_BADGE } from '@/app/styles/estados/prioridad-badge'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import { classname } from '@/lib/class-name'
import { formatearFecha } from '@/utils/formatear-fecha'
import { normalizarTexto } from '@/utils/normalizar-texto'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import SolicitudCotizacionTabContent from './solicitud-cotizacion-tab-content'

type TabId = 'solicitud' | 'cotizaciones' | 'estudio' | 'observaciones'

type SolicitudCotizacionItemProps = {
	solicitud: SolicitudCotizacion
	informacionCompleta: boolean
	idProspecto: number
	nombreCliente: string
	lineaNegocioNombre: string
}

const TAB_LABELS: Record<TabId, string> = {
	solicitud: 'Solicitud',
	cotizaciones: 'Cotizaciones',
	estudio: 'Estudio',
	observaciones: 'Observaciones',
}

const TABS: TabId[] = ['solicitud', 'cotizaciones', 'estudio', 'observaciones']

export default function SolicitudCotizacionItem({
	solicitud,
	informacionCompleta,
	idProspecto,
	nombreCliente,
	lineaNegocioNombre,
}: SolicitudCotizacionItemProps) {
	const [gestionesAbiertas, setGestionesAbiertas] = useState(false)
	const [tabActiva, setTabActiva] = useState<TabId>('solicitud')
	const nombreEjecutivo = solicitud.nombre_ejecutivo_comercial || solicitud.ejecutivo_comercial

	return (
		<li
			key={solicitud.id}
			className={cn(
				'min-w-0 overflow-hidden rounded-lg border border-border/80 bg-card transition-colors',
				gestionesAbiertas && 'border-primary/40 ring-1 ring-primary/20',
			)}
		>
			<div className='p-3 sm:p-3.5'>
				<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
					<div className='min-w-0 flex-1'>
						<p className='truncate text-sm font-semibold text-foreground'>
							{solicitud.producto}
						</p>
						<div className='mt-1 flex flex-wrap items-center gap-1.5'>
							<Badge
								variant='outline'
								className={classname(
									'text-[10px] font-medium capitalize',
									PRIORIDAD_BADGE[solicitud.prioridad],
								)}
							>
								{normalizarTexto(solicitud.prioridad, true)}
							</Badge>
							{!solicitud.informacion_completa && (
								<Badge
									variant='outline'
									className='text-[10px] font-medium capitalize border-sky-500/35 bg-sky-500/10 text-sky-950 dark:text-sky-100'
								>
									Información incompleta
								</Badge>
							)}
							<EstadoCompletitudInformacion
								completa={informacionCompleta}
								className='text-[10px] font-medium capitalize'
							/>
						</div>
						<p className='mt-0.5 text-xs text-muted-foreground'>
							{nombreEjecutivo ? `${nombreEjecutivo} · ` : null}
							{formatearFecha(new Date(solicitud.fecha), 'dd-MM-yyyy · HH:mm')}
						</p>
						{solicitud.observaciones?.trim() ? (
							<p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>
								{solicitud.observaciones.trim()}
							</p>
						) : null}
					</div>

					<div className='flex shrink-0 justify-end'>
						<Button
							type='button'
							variant={gestionesAbiertas ? 'secondary' : 'outline'}
							size='sm'
							className='h-8 text-xs shadow-none'
							onClick={() => {
								setGestionesAbiertas(!gestionesAbiertas)
								if (!gestionesAbiertas) setTabActiva('solicitud')
							}}
						>
							{gestionesAbiertas ? 'Ocultar gestiones' : 'Ver gestiones'}
						</Button>
					</div>
				</div>

				{gestionesAbiertas ? (
					<div className='mt-3 min-w-0'>
						<div className='flex border-b border-border'>
							{TABS.map((t) => (
								<button
									key={t}
									type='button'
									onClick={() => setTabActiva(t)}
									className={cn(
										'-mb-px px-3 py-2 text-xs font-medium transition-colors',
										tabActiva === t
											? 'border-b-2 border-primary text-foreground'
											: 'border-b-2 border-transparent text-muted-foreground hover:text-foreground',
									)}
								>
									{TAB_LABELS[t]}
									{t === 'cotizaciones' && solicitud.cantidad_cotizaciones > 0 ? (
										<span className='ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums'>
											{solicitud.cantidad_cotizaciones}
										</span>
									) : null}
								</button>
							))}
						</div>

						<SolicitudCotizacionTabContent
							solicitud={solicitud}
							idProspecto={idProspecto}
							tab={tabActiva}
							nombreCliente={nombreCliente}
							lineaNegocioNombre={lineaNegocioNombre}
						/>
					</div>
				) : null}
			</div>
		</li>
	)
}
