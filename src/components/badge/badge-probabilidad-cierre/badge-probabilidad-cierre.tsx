import { probabilidadCierreBadgeVariant } from '@/components/badge/variants/probabilidad-cierre-variants'
import { Badge } from '../badge'
import { cn } from '@/lib/utils'

type BadgeProbabilidadCierreProps = {
	probabilidad: number
	className?: string
}

export const BadgeProbabilidadCierre = ({
	probabilidad,
	className,
}: BadgeProbabilidadCierreProps) => {
	return (
		<Badge
			variant={probabilidadCierreBadgeVariant(probabilidad)}
			className={cn('shrink-0 py-1 px-2 text-xs leading-none', className)}
		>
			{Math.round(probabilidad * 100)}%
		</Badge>
	)
}
