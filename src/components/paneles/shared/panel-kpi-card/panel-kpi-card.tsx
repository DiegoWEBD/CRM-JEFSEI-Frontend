'use client'

import { Card, CardContent } from '@/components/card'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

export type KpiAcento = 'info' | 'success' | 'primary' | 'warning' | 'danger' | null

const ACENTO_CARD: Record<NonNullable<KpiAcento>, string> = {
	info: 'border-info/30 bg-info/[0.05]',
	success: 'border-success/30 bg-success/[0.05]',
	primary: 'border-primary/30 bg-primary/[0.05]',
	warning: 'border-warning/35 bg-warning/10',
	danger: 'border-destructive/30 bg-destructive/[0.05]',
}

const ACENTO_ICON: Record<NonNullable<KpiAcento>, string> = {
	info: 'text-info',
	success: 'text-success',
	primary: 'text-primary',
	warning: 'text-warning-foreground dark:text-warning',
	danger: 'text-destructive',
}

type PanelKpiCardProps = {
	label: string
	value: number | string
	icon?: LucideIcon
	accent?: KpiAcento
	activa?: boolean
	onClick?: () => void
}

export function PanelKpiCard({
	label,
	value,
	icon: Icon,
	accent = null,
	activa = false,
	onClick,
}: PanelKpiCardProps) {
	const clickable = Boolean(onClick)
	return (
		<Card
			role={clickable ? 'button' : undefined}
			tabIndex={clickable ? 0 : undefined}
			onClick={onClick}
			onKeyDown={
				clickable
					? e => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault()
								onClick?.()
							}
						}
					: undefined
			}
			className={cn(
				'group gap-0 border-border/70 bg-card py-0 transition-all duration-150',
				clickable && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
				activa && 'border-primary/40 ring-1 ring-primary/15',
				accent && ACENTO_CARD[accent],
			)}
		>
			<CardContent className='flex items-center gap-3 px-4 py-3'>
				{Icon && (
					<div
						className={cn(
							'grid size-8 shrink-0 place-items-center rounded-lg ring-1 transition-colors',
							'bg-muted/70 ring-border/60',
							activa
								? 'bg-primary/10 text-primary ring-primary/20'
								: accent
									? ACENTO_ICON[accent]
									: 'text-muted-foreground',
							'group-hover:bg-primary/10 group-hover:text-primary group-hover:ring-primary/20',
						)}
					>
						<Icon className='size-4' aria-hidden />
					</div>
				)}
				<div className='min-w-0 flex-1'>
					<p className='line-clamp-2 text-[11px] font-medium uppercase leading-snug tracking-wide text-muted-foreground'>
						{label}
					</p>
					<p className='mt-0.5 text-2xl font-semibold tabular-nums leading-tight tracking-tight text-foreground'>
						{value}
					</p>
				</div>
			</CardContent>
		</Card>
	)
}

export function PanelKpiSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div
			className='grid grid-cols-2 gap-3 sm:grid-cols-3'
			style={{ gridTemplateColumns: `repeat(min(${count}, 5), minmax(0, 1fr))` }}
			aria-hidden='true'
		>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className='rounded-lg border border-border/70 bg-card px-4 py-3'>
					<div className='flex items-center gap-3'>
						<div className='size-8 shrink-0 animate-pulse rounded-lg bg-muted' />
						<div className='flex-1 space-y-1.5'>
							<div className='h-3 w-24 animate-pulse rounded bg-muted' />
							<div className='h-6 w-12 animate-pulse rounded bg-muted' />
						</div>
					</div>
				</div>
			))}
		</div>
	)
}