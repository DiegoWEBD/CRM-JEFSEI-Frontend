'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Badge } from '@/components/badge'
import { AlertTriangle, AlertCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Severidad = 'rojo' | 'amarillo' | 'verde'

type Alerta = {
	id: string
	tipo: string
	severidad: Severidad
	titulo: string
	descripcion: string
	cantidad: number
	href: string
}

const SEVERIDAD_CONFIG: Record<
	Severidad,
	{ icon: typeof AlertTriangle; badgeVariant: 'pastel-red' | 'pastel-amber' | 'pastel-emerald'; dotColor: string }
> = {
	rojo: {
		icon: AlertCircle,
		badgeVariant: 'pastel-red',
		dotColor: 'bg-red-500',
	},
	amarillo: {
		icon: AlertTriangle,
		badgeVariant: 'pastel-amber',
		dotColor: 'bg-amber-500',
	},
	verde: {
		icon: CheckCircle2,
		badgeVariant: 'pastel-emerald',
		dotColor: 'bg-emerald-500',
	},
}

const ALERTAS_VACIAS: Alerta[] = []

type AlertasEjecutivoProps = {
	alertas?: Alerta[]
}

export default function AlertasEjecutivo({ alertas = ALERTAS_VACIAS }: AlertasEjecutivoProps) {
	const hayAlertas = alertas.length > 0
	const alertasRojas = alertas.filter(a => a.severidad === 'rojo')
	const alertasAmarillas = alertas.filter(a => a.severidad === 'amarillo')

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-row items-center justify-between border-b border-border px-3 pb-2 pt-3 sm:px-4'>
				<CardTitle primary>Alertas</CardTitle>
				<div className='flex items-center gap-2'>
					{alertasRojas.length > 0 && (
						<Badge variant='pastel-red' className='h-5 text-xs'>
							{alertasRojas.length} urgente{alertasRojas.length > 1 ? 's' : ''}
						</Badge>
					)}
					{alertasAmarillas.length > 0 && (
						<Badge variant='pastel-amber' className='h-5 text-xs'>
							{alertasAmarillas.length} pendiente{alertasAmarillas.length > 1 ? 's' : ''}
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent className='space-y-2 p-3 sm:p-4'>
				{!hayAlertas ? (
					<div className='flex items-center gap-2 rounded-md border border-dashed border-border/80 px-3 py-4 text-center'>
						<CheckCircle2 className='size-4 shrink-0 text-success' aria-hidden />
						<p className='text-xs text-muted-foreground'>
							Sin alertas pendientes. Todo en orden.
						</p>
					</div>
				) : (
					<div className='space-y-1.5'>
						{alertas.map(alerta => {
							const config = SEVERIDAD_CONFIG[alerta.severidad]
							const Icon = config.icon
							return (
								<Link
									key={alerta.id}
									href={alerta.href}
									className={cn(
										'group flex items-center gap-3 rounded-md border border-border/60 px-3 py-2.5 transition-colors hover:bg-accent/40',
									)}
								>
									<span className={cn('size-2 shrink-0 rounded-full', config.dotColor)} aria-hidden />
									<Icon className='size-4 shrink-0 text-muted-foreground' aria-hidden />
									<div className='min-w-0 flex-1'>
										<p className='text-xs font-medium text-foreground'>
											{alerta.titulo}
										</p>
										<p className='text-[11px] text-muted-foreground'>
											{alerta.descripcion}
										</p>
									</div>
									<Badge variant={config.badgeVariant} className='h-5 shrink-0 text-xs tabular-nums'>
										{alerta.cantidad}
									</Badge>
									<ArrowRight className='size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' aria-hidden />
								</Link>
							)
						})}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
