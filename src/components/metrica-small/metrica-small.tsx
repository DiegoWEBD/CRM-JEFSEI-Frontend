import { classname } from '@/lib/class-name'
import { TrendingUp } from 'lucide-react'
import { ReactNode } from 'react'

type MetricaSmallProps = {
	icon: typeof TrendingUp
	label: string
	children: ReactNode
	className?: string
}

export default function MetricaSmall({
	icon: Icon,
	label,
	children,
	className,
}: MetricaSmallProps) {
	return (
		<div
			className={classname(
				'flex min-w-33 items-center gap-2 rounded-md border border-border/80 bg-card px-2.5 py-2 shadow-none',
				className,
			)}
		>
			<div
				className='flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/25 text-muted-foreground'
				aria-hidden
			>
				<Icon className='h-3.5 w-3.5' />
			</div>
			<div className='min-w-0'>
				<p className='text-[10px] leading-tight text-muted-foreground'>
					{label}
				</p>
				<div className='text-sm font-semibold tabular-nums leading-tight text-foreground'>
					{children}
				</div>
			</div>
		</div>
	)
}
