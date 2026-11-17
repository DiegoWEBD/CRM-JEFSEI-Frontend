import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { DashboardSectionHeading } from './dashboard-section-heading'

/**
 * Caja estándar de las secciones del dashboard: mismo borde, fondo,
 * espaciado y encabezado en todas.
 */
export function DashboardSection({
	title,
	description,
	children,
	className,
}: {
	title: string
	description?: string
	children: ReactNode
	className?: string
}) {
	return (
		<section
			aria-label={title}
			className={cn(
				'space-y-3 rounded-xl border border-border/80 bg-muted/[0.02] p-3.5 pt-4 sm:p-4',
				className,
			)}
		>
			<DashboardSectionHeading title={title} description={description} />
			{children}
		</section>
	)
}
