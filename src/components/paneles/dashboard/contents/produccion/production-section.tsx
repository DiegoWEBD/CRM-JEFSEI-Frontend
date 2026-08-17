'use client'

import { MetricasDashboardGerenteJson } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import { DashboardSectionHeading } from '../../shared/dashboard-section-heading'
import MonthlyNetPremiumCard from './monthly-net-premium-card'
import MonthlyNetPremiumTrendChart from './monthly-net-premium-trend-chart'
import NetPremiumByCompanyChart from './net-premium-by-company-chart'
import NetPremiumByExecutiveChart from './net-premium-by-executive-chart'
import NetPremiumByInsuranceLineChart from './net-premium-by-insurance-line-chart'
import TopCompanyCard from './top-company-card'

type ProductionSectionProps = {
  data: MetricasDashboardGerenteJson['produccion']
}

export default function ProductionSection({ data }: ProductionSectionProps) {
  return (
    <section className='space-y-4' aria-labelledby='produccion-comercial'>
      <DashboardSectionHeading title='ProducciÃ³n comercial' />

      <div className='grid gap-2.5 lg:grid-cols-2 lg:items-stretch'>
        <MonthlyNetPremiumCard
          totalPrimaNeta={data.mes_actual.total_prima_neta}
          variacionMesAnterior={data.mes_actual.variacion_mes_anterior}
          mesLabel={data.mes_actual.mes_label}
        />
        <MonthlyNetPremiumTrendChart data={data.tendencia_12_meses} />
      </div>

      <div className='space-y-2.5 border-t border-border/60 pt-4'>
        <h3 className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          CompaÃ±Ã­as principales
        </h3>
        <div className='grid gap-2.5 lg:grid-cols-2 lg:items-stretch'>
          <TopCompanyCard
            nombre={data.compania_top?.nombre ?? null}
            prima_neta={data.compania_top?.prima_neta ?? null}
          />
          <NetPremiumByCompanyChart data={data.por_compania} />
        </div>
      </div>

      <div className='space-y-2.5 border-t border-border/60 pt-4'>
        <h3 className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          DistribuciÃ³n de producciÃ³n
        </h3>
        <div className='grid gap-2.5 lg:grid-cols-2 lg:items-start'>
          <NetPremiumByInsuranceLineChart data={data.por_ramo} />
          <NetPremiumByExecutiveChart data={data.por_ejecutivo} />
        </div>
      </div>
    </section>
  )
}
