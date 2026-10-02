'use client'

import { AlertCircle, AlertTriangle, CheckCheck, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import ItemNotificacion from '@/components/notificaciones/item-notificacion/item-notificacion'
import Paginacion from '@/components/paginacion/paginacion'
import { Skeleton } from '@/components/skeleton'
import { useMarcarNotificacionLeida } from '@/hooks/notificaciones/use-marcar-notificacion-leida'
import { useMarcarNotificacionesLeidas } from '@/hooks/notificaciones/use-marcar-notificaciones-leidas'
import { useNotificaciones } from '@/hooks/notificaciones/use-notificaciones'
import { cn } from '@/lib/utils'
import {
	NivelNotificacion,
	Notificacion,
	ObtenerNotificacionesResponse,
} from '@/types/notificaciones/notificacion'

const TAMANO_GRUPO = 5

const ACENTO_NIVEL: Record<NivelNotificacion, string> = {
	INFO: 'text-info',
	AVISO: 'text-warning',
	CRITICO: 'text-destructive',
}

const ICONO_NIVEL: Record<
	NivelNotificacion,
	typeof AlertTriangle
> = {
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

function GrupoAlertas({
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
		<div className='flex min-w-0 flex-col overflow-hidden rounded-md border border-border/70'>
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
				<ul className='max-h-[22rem] divide-y divide-border overflow-y-auto'>
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

export default function AlertasEjecutivo({ className }: { className?: string }) {
	const router = useRouter()

	const [paginaCriticas, setPaginaCriticas] = useState(1)
	const [paginaAvisos, setPaginaAvisos] = useState(1)

	const criticas = useNotificaciones({
		no_leidas: true,
		nivel: 'CRITICO',
		pagina: paginaCriticas,
		tamano_pagina: TAMANO_GRUPO,
	})
	const avisos = useNotificaciones({
		no_leidas: true,
		nivel: 'AVISO',
		pagina: paginaAvisos,
		tamano_pagina: TAMANO_GRUPO,
	})

	const marcarLeida = useMarcarNotificacionLeida()
	const marcarTodas = useMarcarNotificacionesLeidas()

	const totalCriticas = criticas.data?.total ?? 0
	const totalAvisos = avisos.data?.total ?? 0
	const totalPendientes = totalCriticas + totalAvisos

	const onSeleccionar = (notificacion: Notificacion) => {
		// Al leer una alerta el grupo se encoge: se vuelve a la primera página
		// para no quedar apuntando a una página que ya no existe.
		if (notificacion.nivel === 'CRITICO') setPaginaCriticas(1)
		if (notificacion.nivel === 'AVISO') setPaginaAvisos(1)

		marcarLeida.mutate(notificacion.id, {
			onSuccess: () => {
				if (notificacion.id_prospecto) {
					router.push(`/prospectos/${notificacion.id_prospecto}`)
				}
			},
		})
	}

	return (
		<Card className={cn('border-border bg-card shadow-none', className)}>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex items-center gap-2'>
					<CardTitle primary>Alertas</CardTitle>
					{totalPendientes > 0 && (
						<span className='rounded-full bg-destructive/12 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-destructive'>
							{totalPendientes} sin leer
						</span>
					)}
				</div>

				{totalPendientes > 0 && (
					<button
						type='button'
						onClick={() => {
							setPaginaCriticas(1)
							setPaginaAvisos(1)
							marcarTodas.mutate()
						}}
						disabled={marcarTodas.isPending}
						className='inline-flex items-center gap-1 self-start text-xs font-medium text-primary hover:underline disabled:opacity-50 sm:self-auto'
					>
						{marcarTodas.isPending ? (
							<Loader2 className='size-3 animate-spin' />
						) : (
							<CheckCheck className='size-3' />
						)}
						Marcar todas leídas
					</button>
				)}
			</CardHeader>

			<CardContent className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
				<GrupoAlertas
					titulo='Críticas'
					nivel='CRITICO'
					datos={criticas.data}
					cargando={criticas.isLoading}
					pagina={paginaCriticas}
					idEnviado={marcarLeida.isPending ? marcarLeida.variables : undefined}
					onPaginaChange={setPaginaCriticas}
					onSeleccionar={onSeleccionar}
				/>

				<GrupoAlertas
					titulo='Avisos'
					nivel='AVISO'
					datos={avisos.data}
					cargando={avisos.isLoading}
					pagina={paginaAvisos}
					idEnviado={marcarLeida.isPending ? marcarLeida.variables : undefined}
					onPaginaChange={setPaginaAvisos}
					onSeleccionar={onSeleccionar}
				/>
			</CardContent>
		</Card>
	)
}
