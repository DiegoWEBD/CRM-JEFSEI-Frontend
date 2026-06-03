import { classname } from '@/lib/class-name'
import { ReactNode } from 'react'
import Label from '../label/label'

type CampoProps = {
	label: string
	children: ReactNode
	className?: string
	labelClassName?: string
}

export default function Campo({
	label,
	children,
	className,
	labelClassName,
}: CampoProps) {
	return (
		<div className={classname('space-y-1.5', className)}>
			<Label className={classname('text-sx', labelClassName)}>{label}</Label>
			{children}
		</div>
	)
}
