'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/popover'
import { Skeleton } from '@/components/skeleton'
import { useContadorNoLeidas } from '@/hooks/notificaciones/use-contador-no-leidas'
import { useMarcarNotificacionLeida } from '@/hooks/notificaciones/use-marcar-notificacion-leida'
import { useMarcarNotificacionesLeidas } from '@/hooks/notificaciones/use-marcar-notificaciones-leidas'
import { useNotificaciones } from '@/hooks/notificaciones/use-notificaciones'
import { NivelNotificacion } from '@/types/notificaciones/notificacion'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const NIVEL_DOT: Record<NivelNotificacion, string> = {
	INFO: 'bg-info',
	AVISO: 'bg-warning',
	CRITICO: 'bg-destructive',
}

const NIVEL_BADGE: Record<
	NivelNotificacion,
	'pastel-blue' | 'pastel-amber' | 'pastel-red'
> = {
	INFO: 'pastel-blue',
	AVISO: 'pastel-amber',
	CRITICO: 'pastel-red',
}

const CampanaNotificaciones = () => {
	const [abierto, setAbierto] = useState(false)
	const router = useRouter()

	const { data: contadorData, isLoading: cargandoContador } =
		useContadorNoLeidas()
	const { data, isLoading: cargandoNotificaciones } = useNotificaciones({
		no_leidas: true,
		tamano_pagina: 10,
		enabled: abierto,
	})
	const marcarLeida = useMarcarNotificacionLeida()
	const marcarTodas = useMarcarNotificacionesLeidas()

	const contador = contadorData?.contador ?? 0
	const notificaciones = data?.data ?? []

	const handleAbrir = (open: boolean) => {
		setAbierto(open)
	}

	const handleMarcarLeida = (
		event: React.MouseEvent,
		id: number,
		url: string | null,
	) => {
		event.preventDefault()
		event.stopPropagation()

		marcarLeida.mutate(id, {
			onSuccess: () => {
				if (url) {
					setAbierto(false)
					router.push(url)
				}
			},
		})
	}

	return (
		<Popover open={abierto} onOpenChange={handleAbrir}>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					size='icon-sm'
					className='relative'
					aria-label={`Notificaciones${contador > 0 ? ` (${contador} sin leer)` : ''}`}
				>
					<Bell className='size-4' />
					{cargandoContador ? (
						<span className='absolute -right-0.5 -top-0.5 size-2 animate-pulse rounded-full bg-muted-foreground' />
					) : contador > 0 ? (
						<span className='absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-white'>
							{contador > 99 ? '99+' : contador}
						</span>
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent align='end' className='w-96 p-0'>
				<div className='flex items-center justify-between border-b border-border px-4 py-3'>
					<span className='text-sm font-semibold'>Notificaciones</span>
					{contador > 0 ? (
						<button
							type='button'
							onClick={() => marcarTodas.mutate()}
							disabled={marcarTodas.isPending}
							className='inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-50'
						>
							{marcarTodas.isPending ? (
								<Loader2 className='size-3 animate-spin' />
							) : (
								<CheckCheck className='size-3' />
							)}
							Marcar todas
						</button>
					) : null}
				</div>

				<div className='max-h-96 overflow-y-auto'>
					{cargandoNotificaciones ? (
						<div className='space-y-3 p-4'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className='space-y-2'>
									<Skeleton className='h-4 w-3/4' />
									<Skeleton className='h-3 w-full' />
								</div>
							))}
						</div>
					) : notificaciones.length === 0 ? (
						<div className='px-4 py-8 text-center text-sm text-muted-foreground'>
							Sin notificaciones pendientes
						</div>
					) : (
						<ul className='divide-y divide-border'>
							{notificaciones.map((notificacion) => (
								<li key={notificacion.id}>
									<button
										type='button'
										onClick={(e) =>
											handleMarcarLeida(
												e,
												notificacion.id,
												notificacion.url_destino,
											)
										}
										disabled={marcarLeida.isPending}
										className='flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent disabled:opacity-60'
									>
										<span
											className={cn(
												'mt-1.5 size-2 shrink-0 rounded-full',
												NIVEL_DOT[notificacion.nivel],
											)}
										/>
										<span className='min-w-0 flex-1 space-y-1'>
											<span className='flex items-center gap-2'>
												<span className='truncate text-sm font-medium text-foreground'>
													{notificacion.titulo}
												</span>
												<Badge
													variant={NIVEL_BADGE[notificacion.nivel]}
													className='shrink-0'
												>
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
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default CampanaNotificaciones
