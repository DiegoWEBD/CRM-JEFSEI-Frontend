import { MetricasDashboardGerenteJson } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import DashboardMonthFilter from './dashboard-month-filter'
import MonthlyNetPremiumCard from './monthly-net-premium-card'
import PremiumTrendChart from './premium-trend-chart'
import PremiumByCompanyChart from './premium-by-company-chart'
import PremiumByExecutiveChart from './premium-by-executive-chart'
import PremiumByInsuranceLineChart from './premium-by-insurance-line-chart'
import TopCompanyCard from './top-company-card'

type ProductionSectionProps = {
  data: MetricasDashboardGerenteJson['produccion']
}

export default function ProductionSection({ data }: ProductionSectionProps) {
  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Producción</h2>
        <DashboardMonthFilter mesLabel={data.mes_actual.mes_label} />
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-1'>
          <MonthlyNetPremiumCard
            total_prima_neta={data.mes_actual.total_prima_neta}
            variacion_mes_anterior={data.mes_actual.variacion_mes_anterior}
            mes_label={data.mes_actual.mes_label}
          />
        </div>
        <div className='lg:col-span-2'>
          <TopCompanyCard
            nombre={data.compania_top.nombre}
            prima_neta={data.compania_top.prima_neta}
          />
        </div>
      </div>

      <PremiumTrendChart data={data.tendencia_12_meses} />

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <PremiumByCompanyChart data={data.por_compania} />
        <PremiumByExecutiveChart data={data.por_ejecutivo} />
        <PremiumByInsuranceLineChart data={data.por_ramo} />
      </div>
    </section>
  )
}
