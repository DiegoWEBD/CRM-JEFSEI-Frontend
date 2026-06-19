import { Suspense } from 'react'
import { hasSomeRole } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PanelSolicitudesEstudioClient from '@/components/paneles/solicitudes-estudio/panel-solicitudes-estudio-client'
import { PanelSolicitudesEstudioSkeleton } from '@/components/paneles/solicitudes-estudio/panel-solicitudes-estudio-skeleton'

const ROLES = [
  'EJECUTIVO_EVALUACION_PROYECTOS',
  'GERENTE_COMERCIAL',
  'GERENTE_GENERAL',
  'GERENTE_OPERACIONES',
]

export default async function SolicitudesEstudioPage() {
  const tieneAcceso = await hasSomeRole(ROLES)
  if (!tieneAcceso) redirect('/')
  return (
    <Suspense fallback={<PanelSolicitudesEstudioSkeleton />}>
      <PanelSolicitudesEstudioClient />
    </Suspense>
  )
}
