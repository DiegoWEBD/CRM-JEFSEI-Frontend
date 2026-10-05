'use client'

import { Button } from '@/components/button'
import ItemNotificacion from '@/components/notificaciones/item-notificacion/item-notificacion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover'
import { Skeleton } from '@/components/skeleton'
import { useContadorNoLeidas } from '@/hooks/notificaciones/use-contador-no-leidas'
import { useMarcarNotificacionLeida } from '@/hooks/notificaciones/use-marcar-notificacion-leida'
import { useMarcarNotificacionesLeidas } from '@/hooks/notificaciones/use-marcar-notificaciones-leidas'
import { useNotificaciones } from '@/hooks/notificaciones/use-notificaciones'
import { Notificacion } from '@/types/notificaciones/notificacion'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

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
	const notificaciones = useMemo(() => {
		if (!data) return []

		return data.data.filter(notificacion => notificacion.leible)
	}, [data])

	const handleAbrir = (open: boolean) => {
		setAbierto(open)
	}

	const navegarAProspecto = (notificacion: Notificacion) => {
		if (notificacion.id_prospecto) {
			setAbierto(false)
			router.push(`/prospectos/${notificacion.id_prospecto}`)
		}
	}

	const handleSeleccionar = (notificacion: Notificacion) => {
		if (!notificacion.leible) {
			navegarAProspecto(notificacion)
			return
		}

		marcarLeida.mutate(notificacion.id, {
			onSuccess: () => navegarAProspecto(notificacion),
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
							{notificaciones.map(notificacion => (
								<li key={notificacion.id}>
									<ItemNotificacion
										notificacion={notificacion}
										pendiente={marcarLeida.isPending}
										onSeleccionar={handleSeleccionar}
									/>
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
