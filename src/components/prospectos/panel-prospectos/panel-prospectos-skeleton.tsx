import { PanelKpiSkeleton } from '@/components/paneles/shared/panel-kpi-card'
import { CardProspectosSkeleton } from '@/components/prospectos/card-prospectos/card-prospectos-skeleton'

export function PanelProspectosSkeleton() {
	return (
		<div className='grid gap-4'>
			<PanelKpiSkeleton count={4} />
			<CardProspectosSkeleton />
		</div>
	)
}
