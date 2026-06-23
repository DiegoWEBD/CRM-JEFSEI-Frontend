import { classname } from '@/lib/class-name'
import { Badge } from '../badge/badge'
import { ReactNode } from 'react'

type EstadoCompletitudInformacionProps = {
	completa: boolean
	className?: string
	children?: ReactNode
}

export default function EstadoCompletitudInformacion({
	completa,
	className,
	children,
}: EstadoCompletitudInformacionProps) {
	return (
		<Badge
			variant='outline'
			className={classname(
				className,
				completa
					? 'border-emerald-500/45 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100'
					: 'border-amber-500/45 bg-amber-500/10 text-amber-950 dark:text-amber-100',
			)}
		>
			{children ?? null}
			{!children && `Información ${completa ? 'completa' : 'incompleta'}`}
		</Badge>
	)
}
