import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

export default function DataItemProspecto({
	icon: Icon,
	label,
	value,
	missing,
	className,
}: {
	icon: LucideIcon
	label: string
	value: string | number | undefined | null | boolean
	missing?: boolean
	className?: string
}) {
	const displayValue =
		value === undefined || value === null || value === ''
			? '—'
			: typeof value === 'boolean'
				? value
					? 'Sí'
					: 'No'
				: String(value)

	return (
		<div
			className={cn(
				'flex items-center gap-3 rounded-lg border px-3 py-2.5',
				missing
					? 'border-amber-300 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30'
					: 'border-border/60 bg-muted/15',
				className,
			)}
		>
			<div
				className={cn(
					'flex h-9 w-9 shrink-0 items-center justify-center rounded-md',
					missing
						? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
						: 'bg-primary/10 text-primary',
				)}
			>
				<Icon className='h-4 w-4' aria-hidden />
			</div>
			<div className='min-w-0'>
				<p className='text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
					{label}
				</p>
				<p
					className={cn(
						'text-sm font-semibold',
						missing ? 'text-amber-700 dark:text-amber-300' : 'text-foreground',
					)}
				>
					{displayValue}
				</p>
			</div>
		</div>
	)
}
