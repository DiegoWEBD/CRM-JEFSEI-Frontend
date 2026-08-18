import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { cn } from '@/lib/utils'
import { DatosKpi } from '@/hooks/kpi/dto/datos-kpi'
import { Bell } from 'lucide-react'

type CardKpiProps = {
	datos: DatosKpi
	onClick: (key: string) => void
	accentClassName?: string
	iconClassName?: string
	activo?: boolean
}

export default function CardKpi({ datos, onClick, accentClassName, iconClassName, activo }: CardKpiProps) {
	const Icon = datos.icon
	return (
		<Card
			key={datos.key}
			role='button'
			tabIndex={0}
			className={cn(
				'group cursor-pointer gap-0 overflow-hidden border-border/70 bg-card py-0 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				activo && 'ring-2 ring-primary border-primary/50',
				accentClassName,
			)}
			onClick={() => onClick(datos.key)}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					onClick(datos.key)
				}
			}}
		>
			<CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 px-4 pt-3 pb-2'>
				<CardTitle className='line-clamp-2 min-h-8 text-sm font-medium uppercase tracking-wide leading-snug text-muted-foreground sm:text-xs'>
					{datos.label}
				</CardTitle>
				<div
					className={cn(
						'grid size-8 shrink-0 place-items-center rounded-lg ring-1 transition-colors group-hover:bg-primary/10 group-hover:ring-primary/20',
						iconClassName ?? 'bg-muted/70 text-primary ring-border/60',
					)}
				>
					<Icon className='size-4' aria-hidden />
				</div>
			</CardHeader>
			<CardContent className='space-y-2 px-4 pb-3 pt-0'>
				<p className='text-2xl font-semibold tabular-nums tracking-tight text-foreground'>
					{datos.value}
				</p>
				{datos.infoAdicional != null && datos.infoAdicional > 0 ? (
					<div className='inline-flex items-center gap-1.5 rounded-md border border-warning/30 bg-warning/15 px-2 py-1 text-sm text-warning-foreground dark:text-warning'>
						<Bell className='size-3.5 shrink-0' aria-hidden />
						<span>
							<span className='font-semibold tabular-nums'>
								{datos.infoAdicional}
							</span>{' '}
							nuevo
							{datos.infoAdicional !== 1 ? 's' : ''} por revisar
						</span>
					</div>
				) : null}
			</CardContent>
		</Card>
	)
}