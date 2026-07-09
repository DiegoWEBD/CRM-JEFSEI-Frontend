import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { cn } from '@/lib/utils'
import { DatosKpi } from '@/hooks/kpi/dto/datos-kpi'
import { Bell } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

type CardKpiProps = {
	datos: DatosKpi
	setKpiAbierto: Dispatch<SetStateAction<string | null>>
	accentClassName?: string
	iconClassName?: string
}

export default function CardKpi({ datos, setKpiAbierto, accentClassName, iconClassName }: CardKpiProps) {
	const Icon = datos.icon
	return (
		<Card
			key={datos.key}
			role='button'
			tabIndex={0}
			className={cn(
				'cursor-pointer border-border bg-card transition-all duration-150 hover:border-primary/40 hover:bg-muted/20 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				accentClassName,
			)}
			onClick={() => setKpiAbierto(datos.key)}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					setKpiAbierto(datos.key)
				}
			}}
		>
			<CardHeader className='flex flex-row items-start justify-between gap-2 space-y-0 pb-1 pt-3'>
				<CardTitle className='line-clamp-3 min-h-10 text-[11px] font-semibold leading-snug text-foreground/70 sm:text-xs'>
					{datos.label}
				</CardTitle>
				<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/[0.08]'>
					<Icon className={cn('h-4 w-4 text-primary', iconClassName)} aria-hidden />
				</div>
			</CardHeader>
			<CardContent className='space-y-1.5 pb-3 pt-0'>
				<p className='text-3xl font-bold tabular-nums tracking-tight text-foreground'>
					{datos.value}
				</p>
				{datos.infoAdicional != null && datos.infoAdicional > 0 ? (
					<div className='flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/8 px-2 py-1.5 text-[10px] text-amber-950 dark:text-amber-50'>
						<Bell
							className='h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400'
							aria-hidden
						/>
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
