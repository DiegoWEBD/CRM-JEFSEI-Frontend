import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type PanelBodyProps = {
	children: ReactNode
	className?: string
}

const PanelBody = ({ children, className }: PanelBodyProps) => {
	return (
		<div
			className={cn(
				'grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_30%]',
				'[&>*:only-child]:lg:col-span-2',
				className,
			)}
		>
			{children}
		</div>
	)
}

export default PanelBody
