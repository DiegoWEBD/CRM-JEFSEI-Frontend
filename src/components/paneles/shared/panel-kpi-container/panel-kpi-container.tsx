import { classname } from '@/lib/class-name'
import { ReactNode } from 'react'

type PanelKpiContainerProps = {
	children: ReactNode
	className?: string
}

export default function PanelKpiContainer({
	children,
	className,
}: PanelKpiContainerProps) {
	return (
		<div
			className={classname(
				'grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-2 xl:grid-cols-4',
				className,
			)}
		>
			{children}
		</div>
	)
}
