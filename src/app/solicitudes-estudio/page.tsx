import PanelSolicitudesEstudioClient from '@/components/paneles/solicitudes-estudio/panel-solicitudes-estudio-client'
import { PanelSolicitudesEstudioSkeleton } from '@/components/paneles/solicitudes-estudio/panel-solicitudes-estudio-skeleton'
import { Suspense } from 'react'

export default async function SolicitudesEstudioPage() {
	return (
		<Suspense fallback={<PanelSolicitudesEstudioSkeleton />}>
			<PanelSolicitudesEstudioClient />
		</Suspense>
	)
}
