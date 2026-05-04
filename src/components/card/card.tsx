import { ReactNode } from 'react'

type CardProps = {
	children: ReactNode
	className?: string
	padding?: boolean
}

const Card = ({ children, className, padding = true }: CardProps) => {
	return (
		<div
			className={`bg-card shadow-sm rounded-xl border border-border-primary ${padding ? 'px-3 py-4' : ''} ${className}`}
		>
			{children}
		</div>
	)
}

export default Card
