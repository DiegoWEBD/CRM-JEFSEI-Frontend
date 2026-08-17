'use client'

import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/table'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import Link from 'next/link'
import { Eye, ChevronRight, ExternalLink } from 'lucide-react'
import { formatearFecha } from '@/utils/formatear-fecha'
import BadgeEstadoSolicitud, {
	EstadoSolicitudBandeja,
} from './badge-estado-solicitud'
import BadgePrioridad from '@/components/badge-prioridad/badge-prioridad'
import { cn } from '@/lib/utils'

function resolverEstadoBandeja(
	s: SolicitudCotizacionResumen,
): EstadoSolicitudBandeja {
	if (!s.informacion_completa) return 'informacion_incompleta'
	if (s.estudio_disponible) return 'estudio_emitido'
	if (s.cantidad_cotizaciones > 0) return 'con_cotizaciones'
	return 'lista_para_cotizar'
}

const headClass =
	'h-9 whitespace-nowrap border-b border-border/50 bg-muted/40 px-3 py-2 text-left text-sm font-medium uppercase tracking-wide text-muted-foreground'

const cellClass = 'px-3 py-2.5 align-middle text-sm'

type TablaSolicitudesEstudioProps = {
	solicitudes: SolicitudCotizacionResumen[]
	onVerDetalle: (solicitud: SolicitudCotizacionResumen) => void
}

export default function TablaSolicitudesEstudio({
	solicitudes,
	onVerDetalle,
}: TablaSolicitudesEstudioProps) {
	if (solicitudes.length === 0) {
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					No hay solicitudes que coincidan con los filtros.
				</p>
			</div>
		)
	}

	return (
		<>
			{/* Mobile: card layout */}
			<div className='space-y-3 lg:hidden'>
				{solicitudes.map(s => {
					const estado = resolverEstadoBandeja(s)
					return (
						<Card
							key={s.id}
							className='cursor-pointer border-border bg-card shadow-none transition-colors hover:border-primary/40'
							onClick={() => onVerDetalle(s)}
							onKeyDown={e => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault()
									onVerDetalle(s)
								}
							}}
							tabIndex={0}
							role='button'
						>
							<CardContent className='p-4'>
								<div className='flex items-start justify-between gap-2'>
									<div className='min-w-0 flex-1'>
										<p className='truncate text-sm font-semibold text-foreground'>
											{s.nombre_riesgo}
										</p>
										<p className='mt-0.5 truncate text-xs text-muted-foreground'>
											{s.producto}
										</p>
									</div>
									<ChevronRight className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground' />
								</div>

								<div className='mt-3 flex flex-wrap items-center gap-2'>
									<BadgeEstadoSolicitud estado={estado} />
									{s.recotizacion && (
										<Badge variant='pastel-fuchsia'>
											RecotizaciÃ³n
										</Badge>
									)}
									<BadgePrioridad prioridad={s.prioridad} />
								</div>

								<div className='mt-2 flex items-center justify-between text-sm text-muted-foreground'>
									<span>{s.ejecutivo_comercial}</span>
									<span className='tabular-nums'>
										{formatearFecha(new Date(s.fecha), 'dd-MM-yyyy HH:mm')}
									</span>
								</div>

								<div className='mt-3' onClick={e => e.stopPropagation()} role='presentation'>
									<Button
										variant='outline'
										size='sm'
										className='h-8 w-full px-2.5 text-xs shadow-none'
										asChild
									>
										<Link href={`/prospectos/${s.id_prospecto}`}>
											<ExternalLink className='mr-1 h-3.5 w-3.5' />
											Ver perfil
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>

			{/* Desktop: table layout */}
			<div className='hidden overflow-x-auto lg:block'>
				<Table className='w-full'>
					<TableHeader>
						<TableRow className='border-0 hover:bg-transparent'>
							<TableHead className={cn(headClass, 'min-w-[160px]')}>
								Cliente
							</TableHead>
							<TableHead className={cn(headClass, 'min-w-[130px]')}>
								LÃ­nea de seguro
							</TableHead>
							<TableHead className={cn(headClass, 'min-w-[148px]')}>
								Estado
							</TableHead>
							<TableHead className={cn(headClass, 'min-w-[110px]')}>
								Ejecutivo comercial
							</TableHead>
							<TableHead className={cn(headClass, 'min-w-[118px]')}>
								Fecha de solicitud
							</TableHead>
							<TableHead className={cn(headClass, 'w-[96px]')}>
								Prioridad
							</TableHead>
							<TableHead className={cn(headClass, 'min-w-[220px] text-right')}>
								AcciÃ³n
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{solicitudes.map(s => {
							const estado = resolverEstadoBandeja(s)
							return (
<TableRow
								key={s.id}
								className={cn(
									'border-b border-border/60 transition-colors hover:bg-accent/40',
									estado === 'con_cotizaciones' && 'bg-muted/15',
								)}
							>
								<TableCell className={cn(cellClass, 'max-w-[200px]')}>
									<p className='truncate font-medium text-foreground'>
										{s.nombre_riesgo}
									</p>
								</TableCell>
								<TableCell className={cn(cellClass, 'max-w-[180px]')}>
									<p className='line-clamp-2 text-foreground/85'>
										{s.producto}
									</p>
								</TableCell>
								<TableCell className={cellClass}>
									<div className='flex flex-wrap items-center gap-1.5'>
										<BadgeEstadoSolicitud estado={estado} />
										{s.recotizacion && (
											<Badge variant='pastel-fuchsia'>
												RecotizaciÃ³n
											</Badge>
										)}
									</div>
								</TableCell>
								<TableCell className={cn(cellClass, 'max-w-[120px] truncate text-muted-foreground')}>
									{s.ejecutivo_comercial}
								</TableCell>
								<TableCell className={cn(cellClass, 'min-w-[110px]')}>
									<p className='tabular-nums text-foreground/90'>
										{formatearFecha(new Date(s.fecha), 'dd-MM-yyyy')}
									</p>
									<p className='tabular-nums text-sm text-muted-foreground'>
										{formatearFecha(new Date(s.fecha), 'HH:mm')}
									</p>
								</TableCell>
								<TableCell className={cn(cellClass, 'py-1.5')}>
									<BadgePrioridad prioridad={s.prioridad} />
								</TableCell>
								<TableCell className={cn(cellClass, 'min-w-[220px] text-right')}>
									<div className='flex flex-wrap items-center justify-end gap-1.5'>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-8 shrink-0 px-2.5 text-xs shadow-none'
									onClick={() => onVerDetalle(s)}
								>
									<Eye className='mr-1 h-3.5 w-3.5' />
									Ver solicitud
								</Button>
								<Button
									variant='outline'
									size='sm'
									className='h-8 shrink-0 px-2.5 text-xs shadow-none'
									asChild
								>
									<Link href={`/prospectos/${s.id_prospecto}`}>
										<ExternalLink className='mr-1 h-3.5 w-3.5' />
										Ver perfil
									</Link>
								</Button>
									</div>
								</TableCell>
							</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</div>
		</>
	)
}
