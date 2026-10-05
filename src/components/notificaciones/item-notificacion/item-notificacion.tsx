'use client'

import { Badge } from '@/components/badge'
import { cn } from '@/lib/utils'
import {
	NivelNotificacion,
	Notificacion,
} from '@/types/notificaciones/notificacion'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export const NIVEL_DOT: Record<NivelNotificacion, string> = {
	INFO: 'bg-info',
	AVISO: 'bg-warning',
	CRITICO: 'bg-destructive',
}

export const NIVEL_BADGE: Record<
	NivelNotificacion,
	'pastel-blue' | 'pastel-amber' | 'pastel-red'
> = {
	INFO: 'pastel-blue',
	AVISO: 'pastel-amber',
	CRITICO: 'pastel-red',
}

type ItemNotificacionProps = {
	notificacion: Notificacion
	pendiente?: boolean
	onSeleccionar: (notificacion: Notificacion) => void
}

export default function ItemNotificacion({
	notificacion,
	pendiente = false,
	onSeleccionar,
}: ItemNotificacionProps) {
	return (
		<Link
			href={`/prospectos/${notificacion.id_prospecto}`}
			onClick={() => onSeleccionar(notificacion)}
			className='cursor-pointer flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent disabled:opacity-60'
		>
			<span
				className={cn(
					'mt-1.5 size-2 shrink-0 rounded-full',
					NIVEL_DOT[notificacion.nivel],
				)}
				aria-hidden
			/>
			<span className='min-w-0 flex-1 space-y-1'>
				<span className='flex items-center gap-2'>
					<span className='truncate text-sm font-medium text-foreground'>
						{notificacion.titulo}
					</span>
					<Badge variant={NIVEL_BADGE[notificacion.nivel]} className='shrink-0'>
						{notificacion.nivel}
					</Badge>
				</span>
				<span className='line-clamp-2 text-xs text-muted-foreground'>
					{notificacion.mensaje}
				</span>
				<span className='block text-[11px] text-muted-foreground/70'>
					{formatDistanceToNow(new Date(notificacion.created_at), {
						addSuffix: true,
						locale: es,
					})}
				</span>
			</span>
			{pendiente && (
				<Loader2 className='mt-1 size-3.5 shrink-0 animate-spin text-muted-foreground' />
			)}
		</Link>
	)
}
