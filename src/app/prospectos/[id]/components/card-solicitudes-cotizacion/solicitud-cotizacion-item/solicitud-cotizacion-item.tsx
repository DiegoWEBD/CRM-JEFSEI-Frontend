import { PRIORIDAD_BADGE } from '@/app/styles/estados/prioridad-badge'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import ConfirmDialog from '@/components/confirm-dialog/confirm-dialog'
import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { useEliminarSolicitudCotizacion } from '@/hooks/solicitudes-cotizacion/use-eliminar-solicitud-cotizacion'

import { cn } from '@/lib/utils'
import { formatearFecha } from '@/utils/formatear-fecha'
import { normalizarTexto } from '@/utils/normalizar-texto'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import SolicitudCotizacionTabContent, {
	TabId,
} from './solicitud-cotizacion-tab-content'

type SolicitudCotizacionItemProps = {
	solicitud: SolicitudCotizacion
	informacionCompleta: boolean
	idProspecto: number
	idProceso: number
	nombreCliente: string
	lineaNegocioNombre: string
	ejecutivoComercialRut?: string
	ejecutivoEvaluacionRut?: string
}

const TAB_LABELS: Record<TabId, string> = {
	solicitud: 'Solicitud',
	cotizaciones: 'Cotizaciones',
	estudio: 'Estudio',
}

const ALL_TABS: TabId[] = ['solicitud', 'cotizaciones', 'estudio']
const TIPOS_CON_ESTUDIO = ['unidades', 'espacios_comunes']

export default function SolicitudCotizacionItem({
	solicitud,
	informacionCompleta,
	idProspecto,
	idProceso,
	nombreCliente,
	lineaNegocioNombre,
	ejecutivoComercialRut,
	ejecutivoEvaluacionRut,
}: SolicitudCotizacionItemProps) {
	const { usuario } = useUserSession()
	const [tabActiva, setTabActiva] = useState<TabId>('solicitud')
	const [solicitudAEliminar, setSolicitudAEliminar] = useState(false)
	const eliminarMutation = useEliminarSolicitudCotizacion(
		idProspecto,
		idProceso,
	)
	const tabs = ALL_TABS.filter(
		t =>
			t !== 'estudio' ||
			TIPOS_CON_ESTUDIO.includes(solicitud.tipo.toLowerCase()),
	)

	return (
		<li
			key={solicitud.id}
			className={cn(
				'min-w-0 overflow-hidden rounded-lg border border-border/80 bg-card transition-colors',
				'border-primary/40 ring-1 ring-primary/20',
			)}
		>
			<div className='p-3 sm:p-3.5'>
				<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
					<div className='min-w-0 flex flex-col gap-1'>
						<div className='mt-1 flex flex-wrap items-center gap-1.5'>
							<Badge
								variant={PRIORIDAD_BADGE[solicitud.prioridad]}
								className='text-xs font-medium capitalize'
							>
								{normalizarTexto(solicitud.prioridad, true)}
							</Badge>

							<EstadoCompletitudInformacion
								completa={informacionCompleta}
								className='text-xs font-medium capitalize'
							/>
						</div>
						<p className='mt-0.5 text-xs text-muted-foreground'>
							{formatearFecha(new Date(solicitud.fecha), 'dd-MM-yyyy · HH:mm')}
						</p>
						{solicitud.cantidad_cotizaciones > 0 ? (
							<p className='mt-1 flex flex-wrap items-center gap-1.5'>
								<span className='inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground'>
									{solicitud.cantidad_cotizaciones}{' '}
									{solicitud.cantidad_cotizaciones !== 1
										? 'cotizaciones'
										: 'cotización'}
								</span>
							</p>
						) : null}
						{solicitud.observaciones?.trim() ? (
							<p className='mt-1 line-clamp-2 text-sm font-semibold italic'>
								{solicitud.observaciones.trim()}
							</p>
						) : null}
					</div>

					{usuario?.rut === ejecutivoComercialRut && (
						<PermissionGuard
							allowedPermissions={['ELIMINAR_SOLICITUD_COTIZACION']}
						>
							<Button
								type='button'
								variant='ghost'
								size='icon-sm'
								onClick={() => setSolicitudAEliminar(true)}
								aria-label='Eliminar solicitud'
								className='text-destructive hover:text-destructive'
							>
								<Trash2 className='h-3.5 w-3.5' />
							</Button>
						</PermissionGuard>
					)}
				</div>

				<div className='mt-3 min-w-0'>
					<div className='flex border-b border-border'>
						{tabs.map(t => (
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
									<span className='ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs tabular-nums'>
										{solicitud.cantidad_cotizaciones}
									</span>
								) : null}
							</button>
						))}
					</div>

					<SolicitudCotizacionTabContent
						solicitud={solicitud}
						idProspecto={idProspecto}
						idProcesoComercial={idProceso}
						tab={tabActiva}
						nombreCliente={nombreCliente}
						lineaNegocioNombre={lineaNegocioNombre}
						ejecutivoEvaluacionRut={ejecutivoEvaluacionRut}
					/>
				</div>
			</div>

			<ConfirmDialog
				open={solicitudAEliminar}
				onOpenChange={() => setSolicitudAEliminar(false)}
				title='Eliminar solicitud de cotización'
				description={`¿Eliminar la solicitud de ${solicitud.producto || solicitud.tipo}? Esto también eliminará sus cotizaciones asociadas. Esta acción no se puede deshacer.`}
				confirmText='Eliminar'
				onConfirm={() => {
					eliminarMutation.mutate(solicitud.id, {
						onSuccess: () => setSolicitudAEliminar(false),
					})
				}}
				isPending={eliminarMutation.isPending}
			/>
		</li>
	)
}
