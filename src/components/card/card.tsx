import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type CardProps = {
	children: ReactNode
	className?: string
}

const Card = ({ children, className }: CardProps) => {
	return (
		<div
			className={twMerge(
				'bg-card shadow-sm rounded-xl border border-border-primary px-3 py-4',
				className,
			)}
		>
			{children}
		</div>
	)
}

export default Card
