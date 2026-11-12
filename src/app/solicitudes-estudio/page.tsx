import { PanelSolicitudesEstudioInner } from '@/components/paneles/solicitudes-estudio/panel-solicitudes-estudio-inner'
import { PanelSolicitudesEstudioSkeleton } from '@/components/paneles/solicitudes-estudio/panel-solicitudes-estudio-skeleton'
import { Suspense } from 'react'

export default function SolicitudesEstudioPage() {
	return (
		<Suspense fallback={<PanelSolicitudesEstudioSkeleton />}>
			<PanelSolicitudesEstudioInner />
		</Suspense>
	)
}
