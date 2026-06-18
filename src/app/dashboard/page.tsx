import { getSession, hasSomeRole } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PanelDashboardClient from '@/components/paneles/dashboard/panel-dashboard-client'

const ROLES_GERENTE = ['GERENTE_COMERCIAL', 'GERENTE_GENERAL', 'GERENTE_OPERACIONES']

export default async function DashboardPage() {
  const esGerente = await hasSomeRole(ROLES_GERENTE)

  if (!esGerente) {
    redirect('/')
  }

  const session = await getSession()

  return <PanelDashboardClient usuarioNombre={session?.nombre ?? ''} />
}
