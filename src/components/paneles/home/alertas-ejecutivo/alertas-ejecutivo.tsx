'use client'

import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { useMarcarNotificacionLeida } from '@/hooks/notificaciones/use-marcar-notificacion-leida'
import { useNotificaciones } from '@/hooks/notificaciones/use-notificaciones'
import { cn } from '@/lib/utils'
import { Notificacion } from '@/types/notificaciones/notificacion'
import { GrupoAlertas } from './grupo-alertas/grupo-alertas'

const TAMANO_GRUPO = 5

export default function AlertasEjecutivo({
	className,
}: {
	className?: string
}) {
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

	const totalCriticas = criticas.data?.total ?? 0
	const totalAvisos = avisos.data?.total ?? 0
	const totalPendientes = totalCriticas + totalAvisos

	const onSeleccionar = (notificacion: Notificacion) => {
		if (notificacion.leible) {
			marcarLeida.mutate(notificacion.id)
		}
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
