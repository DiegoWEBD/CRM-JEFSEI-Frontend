import ItemNotificacion from '@/components/notificaciones/item-notificacion/item-notificacion'
import Paginacion from '@/components/paginacion/paginacion'
import { Skeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils'
import {
	NivelNotificacion,
	ObtenerNotificacionesResponse,
	Notificacion,
} from '@/types/notificaciones/notificacion'
import { AlertCircle, AlertTriangle } from 'lucide-react'

const ACENTO_NIVEL: Record<NivelNotificacion, string> = {
	INFO: 'text-info',
	AVISO: 'text-warning',
	CRITICO: 'text-destructive',
}

const ICONO_NIVEL: Record<NivelNotificacion, typeof AlertTriangle> = {
	INFO: AlertTriangle,
	AVISO: AlertTriangle,
	CRITICO: AlertCircle,
}

type GrupoAlertasProps = {
	titulo: string
	nivel: NivelNotificacion
	datos?: ObtenerNotificacionesResponse
	cargando: boolean
	pagina: number
	idEnviado?: number
	onPaginaChange: (pagina: number) => void
	onSeleccionar: (notificacion: Notificacion) => void
}

export function GrupoAlertas({
	titulo,
	nivel,
	datos,
	cargando,
	pagina,
	idEnviado,
	onPaginaChange,
	onSeleccionar,
}: GrupoAlertasProps) {
	const Icono = ICONO_NIVEL[nivel]
	const total = datos?.total ?? 0
	const notificaciones = datos?.data ?? []

	return (
		<div className='flex min-w-0 flex-col overflow-hidden rounded-md border border-border/70 h-110'>
			<div className='flex items-center justify-between gap-2 border-b border-border/70 bg-muted/30 px-3 py-2'>
				<span className='flex min-w-0 items-center gap-2'>
					<Icono
						className={cn('size-3.5 shrink-0', ACENTO_NIVEL[nivel])}
						aria-hidden
					/>
					<span className='truncate text-xs font-semibold uppercase tracking-wider text-foreground'>
						{titulo}
					</span>
				</span>
				<span
					className={cn(
						'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
						nivel === 'CRITICO'
							? 'bg-destructive/12 text-destructive'
							: 'bg-warning/15 text-warning',
					)}
				>
					{total}
				</span>
			</div>

			{cargando || (total > 0 && notificaciones.length === 0) ? (
				<div className='divide-y divide-border'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className='space-y-2 px-4 py-3'>
							<Skeleton className='h-4 w-3/4' />
							<Skeleton className='h-3 w-full' />
							<Skeleton className='h-3 w-1/3' />
						</div>
					))}
				</div>
			) : total === 0 ? (
				<p className='px-4 py-5 text-center text-xs text-muted-foreground'>
					{nivel === 'CRITICO'
						? 'Sin alertas críticas. ¡Todo bajo control!'
						: 'Sin avisos pendientes.'}
				</p>
			) : (
				<ul className='max-h-88 divide-y divide-border overflow-y-auto'>
					{notificaciones.map(notificacion => (
						<li key={notificacion.id}>
							<ItemNotificacion
								notificacion={notificacion}
								pendiente={idEnviado === notificacion.id}
								onSeleccionar={onSeleccionar}
							/>
						</li>
					))}
				</ul>
			)}

			<Paginacion
				pagina={Math.min(pagina, Math.max(datos?.total_paginas ?? 1, 1))}
				totalPaginas={datos?.total_paginas ?? 1}
				onPaginaChange={onPaginaChange}
			/>
		</div>
	)
}
