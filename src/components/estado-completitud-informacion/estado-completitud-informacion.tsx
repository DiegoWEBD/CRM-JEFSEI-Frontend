import { ReactNode } from 'react'
import { Badge } from '../badge/badge'

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
			variant={completa ? 'pastel-emerald' : 'pastel-amber'}
			className={className}
		>
			{children ?? null}
			{!children && `Información ${completa ? 'completa' : 'incompleta'}`}
		</Badge>
	)
}
