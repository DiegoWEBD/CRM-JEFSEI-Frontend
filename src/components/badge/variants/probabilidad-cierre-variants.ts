import { BadgeVariant } from '@/lib/badge-variants'

export const probabilidadCierreBadgeVariant = (
	probabilidad: number,
): BadgeVariant => {
	if (probabilidad < 0.5) return 'pastel-red'
	if (probabilidad >= 0.5 && probabilidad < 0.7) return 'pastel-amber'
	return 'pastel-emerald'
}
