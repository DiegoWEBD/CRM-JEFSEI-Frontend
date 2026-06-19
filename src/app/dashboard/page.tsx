import { Suspense } from 'react'
import { getSession, hasSomeRole } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PanelDashboardClient from '@/components/paneles/dashboard/panel-dashboard-client'
import { DashboardSkeleton } from '@/components/paneles/dashboard/panel-dashboard-skeleton'

const ROLES_GERENTE = ['GERENTE_COMERCIAL', 'GERENTE_GENERAL', 'GERENTE_OPERACIONES']

async function DashboardInner() {
  const session = await getSession()
  return <PanelDashboardClient usuarioNombre={session?.nombre ?? ''} />
}

export default async function DashboardPage() {
  const esGerente = await hasSomeRole(ROLES_GERENTE)

  if (!esGerente) {
    redirect('/')
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardInner />
    </Suspense>
  )
}
