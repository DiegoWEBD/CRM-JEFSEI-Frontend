import { DashboardSectionHeading } from './shared/dashboard-section-heading'
import EstimatedPotentialPremiumCard from './contents/pipeline-oportunidades/estimated-potential-premium-card'
import ExpectedPremiumCard from './contents/pipeline-oportunidades/expected-premium-card'
import QuotedPremiumCard from './contents/pipeline-oportunidades/quoted-premium-card'
import MonthlyComisionCard from './contents/produccion/monthly-comision-card'
import MonthlyNetPremiumCard from './contents/produccion/monthly-net-premium-card'

/**
 * Indicadores clave del dashboard, separados por dominio: producción del
 * período (prima neta y comisión, dependen de mes/año) y pipeline de
 * oportunidades abiertas (prima cotizada, potencial y esperada, no
 * dependen del filtro).
 */
export default function DashboardKpisRow({
	tipo,
}: {
	tipo: 'pipeline' | 'produccion'
}) {
	return (
		<section className='space-y-3 pt-1' aria-label='Indicadores clave'>
			<DashboardSectionHeading
				title='Indicadores clave'
				description={
					tipo === 'pipeline'
						? 'Pipeline de oportunidades abiertas.'
						: 'Producción del período seleccionado.'
				}
			/>

			<div
				className={
					tipo === 'pipeline'
						? 'grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:items-stretch'
						: 'grid grid-cols-2 gap-2.5 lg:items-stretch'
				}
			>
				{tipo === 'pipeline' ? (
					<>
						<QuotedPremiumCard />
						<EstimatedPotentialPremiumCard />
						<ExpectedPremiumCard />
					</>
				) : (
					<>
						<MonthlyNetPremiumCard />
						<MonthlyComisionCard />
					</>
				)}
			</div>
		</section>
	)
}
