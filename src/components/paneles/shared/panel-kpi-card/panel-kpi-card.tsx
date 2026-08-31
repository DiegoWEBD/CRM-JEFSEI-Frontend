'use client'

import { cn } from '@/lib/utils'
import { KPI_PASTEL } from '@/lib/kpi-pastel'
import { type LucideIcon } from 'lucide-react'

export type KpiAcento =
	| 'info'
	| 'success'
	| 'primary'
	| 'warning'
	| 'danger'
	| null

const ACENTO_CARD: Record<NonNullable<KpiAcento>, string> = {
	info: KPI_PASTEL.info.card,
	success: KPI_PASTEL.success.card,
	primary: KPI_PASTEL.primary.card,
	warning: KPI_PASTEL.warning.card,
	danger: KPI_PASTEL.danger.card,
}

const ACENTO_ICON: Record<NonNullable<KpiAcento>, string> = {
	info: KPI_PASTEL.info.icon,
	success: KPI_PASTEL.success.icon,
	primary: KPI_PASTEL.primary.icon,
	warning: KPI_PASTEL.warning.icon,
	danger: KPI_PASTEL.danger.icon,
}

const ACENTO_BORDER_LEFT: Record<NonNullable<KpiAcento>, string> = {
	info: 'border-l-info',
	success: 'border-l-success',
	primary: 'border-l-primary',
	warning: 'border-l-warning',
	danger: 'border-l-destructive',
}

type PanelKpiCardProps = {
	label: string
	value: number | string
	subtitle?: string
	icon?: LucideIcon
	accent?: KpiAcento
	activa?: boolean
	onClick?: () => void
}

export function PanelKpiCard({
	label,
	value,
	subtitle,
	icon: Icon,
	accent = null,
	activa = false,
	onClick,
}: PanelKpiCardProps) {
	const clickable = Boolean(onClick)
	return (
		<div
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
				'flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 transition-colors duration-150',
				clickable && 'cursor-pointer hover:bg-accent/50',
				activa && accent
					? cn('border-l-2', ACENTO_BORDER_LEFT[accent], ACENTO_CARD[accent])
					: activa
						? 'border-l-2 border-l-primary bg-primary/5'
						: 'border-border/50',
			)}
		>
			{Icon && (
				<div
					className={cn(
						'grid size-6 shrink-0 place-items-center rounded ring-1 transition-colors',
						activa
							? accent
								? ACENTO_ICON[accent]
								: 'bg-primary/10 text-primary ring-primary/15'
							: accent
								? ACENTO_ICON[accent]
								: 'bg-muted text-muted-foreground ring-border/40',
					)}
				>
					<Icon className='size-3.5' aria-hidden />
				</div>
			)}
			<div className='min-w-0 flex-1'>
				<p className='truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground'>
					{label}
				</p>
				<p className='text-lg font-bold tabular-nums leading-tight tracking-tight text-foreground'>
					{value}
				</p>
				{subtitle && (
					<p className='text-[10px] tabular-nums text-muted-foreground'>
						{subtitle}
					</p>
				)}
			</div>
		</div>
	)
}

export function PanelKpiSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div
			className='grid grid-cols-2 gap-2 sm:grid-cols-3'
			style={{
				gridTemplateColumns: `repeat(min(${count}, 5), minmax(0, 1fr))`,
			}}
			aria-hidden='true'
		>
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className='flex items-center gap-2.5 rounded-md border border-border/50 bg-card px-3 py-2'
				>
					<div className='size-6 shrink-0 animate-pulse rounded bg-muted' />
					<div className='flex-1 space-y-1'>
						<div className='h-2.5 w-16 animate-pulse rounded bg-muted' />
						<div className='h-5 w-10 animate-pulse rounded bg-muted' />
					</div>
				</div>
			))}
		</div>
	)
}
