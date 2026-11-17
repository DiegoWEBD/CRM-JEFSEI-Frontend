import type { FiltrosDashboard } from '@/lib/filtros-dashboard'
import { DashboardSectionHeading } from './shared/dashboard-section-heading'
import CloseRateCard from './contents/pipeline-oportunidades/close-rate-card'
import EstimatedPotentialPremiumCard from './contents/pipeline-oportunidades/estimated-potential-premium-card'
import ExpectedPremiumCard from './contents/pipeline-oportunidades/expected-premium-card'
import QuotedPremiumCard from './contents/pipeline-oportunidades/quoted-premium-card'
import MonthlyComisionCard from './contents/produccion/monthly-comision-card'
import MonthlyNetPremiumCard from './contents/produccion/monthly-net-premium-card'

/**
 * Indicadores clave del dashboard, separados por dominio: producción del
 * período (prima neta y comisión, dependen de mes/año) y pipeline de
 * oportunidades (prima cotizada, potencial y esperada de las abiertas, y
 * tasa de cierre de las cerradas; no dependen del filtro).
 *
 * `prefetch` se propaga a cada tarjeta para que solo la pestaña activa
 * haga prefetch SSR de sus métricas.
 */
export default function DashboardKpisRow({
	tipo,
	prefetch = true,
	filtros,
}: {
	tipo: 'pipeline' | 'produccion'
	prefetch?: boolean
	filtros?: FiltrosDashboard
}) {
	return (
		<section className='space-y-3 pt-1' aria-label='Indicadores clave'>
			<DashboardSectionHeading
				title='Indicadores clave'
				description={
					tipo === 'pipeline'
						? 'Pipeline de oportunidades.'
						: 'Producción del período seleccionado.'
				}
			/>

			<div
				className={
					tipo === 'pipeline'
						? 'grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:items-stretch'
						: 'grid grid-cols-2 gap-2.5 lg:items-stretch'
				}
			>
				{tipo === 'pipeline' ? (
					<>
						<QuotedPremiumCard prefetch={prefetch} />
						<EstimatedPotentialPremiumCard prefetch={prefetch} />
						<ExpectedPremiumCard prefetch={prefetch} />
						<CloseRateCard prefetch={prefetch} />
					</>
				) : (
					<>
						<MonthlyNetPremiumCard prefetch={prefetch} filtros={filtros} />
						<MonthlyComisionCard prefetch={prefetch} filtros={filtros} />
					</>
				)}
			</div>
		</section>
	)
}
