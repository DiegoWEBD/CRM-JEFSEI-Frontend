import AuthGuard from '@/components/layouts/guards/auth-guard'
import PanelSolicitudesEstudioClient from '@/components/paneles/solicitudes-estudio/panel-solicitudes-estudio-client'
import { PanelSolicitudesEstudioSkeleton } from '@/components/paneles/solicitudes-estudio/panel-solicitudes-estudio-skeleton'
import { Suspense } from 'react'

const ROLES = [
	'EJECUTIVO_EVALUACION_PROYECTOS',
	'GERENTE_COMERCIAL',
	'GERENTE_GENERAL',
	'GERENTE_OPERACIONES',
]

export default async function SolicitudesEstudioPage() {
	return (
		<AuthGuard allowedRoles={ROLES}>
			<Suspense fallback={<PanelSolicitudesEstudioSkeleton />}>
				<PanelSolicitudesEstudioClient />
			</Suspense>
		</AuthGuard>
	)
}
