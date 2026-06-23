import { Suspense } from 'react'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { PanelSkeleton } from './panel-skeleton'
import { PanelInner } from './panel-inner'

const ROLES: string[] = [
  'EJECUTIVO_EVALUACION_PROYECTOS',
  'GERENTE_COMERCIAL',
  'GERENTE_GENERAL',
  'GERENTE_OPERACIONES',
]

export default function CotizacionesEstudiosPage() {
  return (
    <AuthGuard allowedRoles={ROLES} fallback={null}>
      <Suspense fallback={<PanelSkeleton />}>
        <PanelInner />
      </Suspense>
    </AuthGuard>
  )
}
