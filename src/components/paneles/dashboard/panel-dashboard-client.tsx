'use client'

import AuthGuard from '@/components/layouts/guards/auth-guard'
import TituloPagina from '@/components/titulos/titulo-pagina'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'

import { useMetricasDashboardGerente } from '@/hooks/dashboard-gerente/use-metricas-dashboard-gerente'
import ProductionSection from './contents/produccion/production-section'
import CommercialActivitiesSection from './contents/actividades-comerciales/commercial-activities-section'
import PoliciesReportsSection from './contents/reportes-polizas/policies-reports-section'
import EvaluacionProyectosSection from './contents/evaluacion-proyectos/evaluacion-proyectos-section'
import { Separator } from '@/components/separator'
import Loader from '@/components/loaders/loder'

const ROLES_GERENTE = ['GERENTE_COMERCIAL', 'GERENTE_GENERAL', 'GERENTE_OPERACIONES']

type PanelDashboardClientProps = {
  usuarioNombre: string
}

export default function PanelDashboardClient({
  usuarioNombre,
}: PanelDashboardClientProps) {
  const { data: metricas, isLoading, error } = useMetricasDashboardGerente()

  if (isLoading) {
    return <Loader />
  }

  if (error || !metricas) {
    return (
      <div className='flex items-center justify-center py-12'>
        <p className='text-sm text-muted-foreground'>
          Error al cargar métricas del dashboard.
        </p>
      </div>
    )
  }

  return (
    <AuthGuard allowedRoles={ROLES_GERENTE} fallback={null}>
      <PanelLayout>
        <PanelHeader>
          <div className='flex items-center justify-between'>
            <TituloPagina>Dashboard</TituloPagina>
            <p className='text-sm text-muted-foreground'>
              Bienvenido,{' '}
              <span className='font-medium text-foreground'>
                {usuarioNombre}
              </span>
            </p>
          </div>
        </PanelHeader>

        <div className='space-y-8'>
          <ProductionSection data={metricas.produccion} />
          <Separator />
          <CommercialActivitiesSection
            data={metricas.actividades_comerciales}
          />
          <Separator />
          <PoliciesReportsSection data={metricas.reportes_polizas} />
          <Separator />
          <EvaluacionProyectosSection data={metricas.evaluacion_proyectos} />
        </div>
      </PanelLayout>
    </AuthGuard>
  )
}
