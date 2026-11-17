'use client'

import type { ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs'
import FiltrosDashboardBar from './filtros-dashboard-bar'

export type TabDashboard = 'pipeline' | 'produccion'

const TABS: { value: TabDashboard; label: string }[] = [
	{ value: 'pipeline', label: 'Pipeline comercial' },
	{ value: 'produccion', label: 'Producción comercial' },
]

function esTabDashboard(value: string | null): value is TabDashboard {
	return value === 'pipeline' || value === 'produccion'
}

/**
 * Pestañas del dashboard de gerencia ("páginas" del informe).
 *
 * El tab activo vive en la URL (`?tab=…`, por defecto `pipeline`) y se
 * actualiza con `replaceState` (routing superficial): cambiar de pestaña
 * no dispara un roundtrip al servidor ni re-prefetchea las métricas.
 *
 * El contenido de ambas pestañas se mantiene montado (`forceMount` y
 * oculto por CSS): al volver a una pestaña conserva sus selecciones y no
 * re-anima los gráficos. Los contenidos llegan como nodos desde el
 * servidor, así cada tarjeta conserva su prefetch SSR + hidratación.
 *
 * La barra de filtros mes/año solo aplica a producción (las métricas de
 * pipeline son oportunidades abiertas, no dependen del período).
 */
export default function DashboardTabs({
	pipeline,
	produccion,
}: {
	pipeline: ReactNode
	produccion: ReactNode
}) {
	const searchParams = useSearchParams()
	const tabParam = searchParams.get('tab')
	const tab: TabDashboard = esTabDashboard(tabParam) ? tabParam : 'pipeline'

	const cambiarTab = (value: string) => {
		window.history.replaceState(null, '', `?tab=${value}`)
	}

	return (
		<Tabs value={tab} onValueChange={cambiarTab} className='gap-0'>
			<div className='-mx-3 border-b border-border/60 px-3 pb-3 pt-2.5 lg:-mx-8 lg:px-8'>
				<TabsList>
					{TABS.map((t) => (
						<TabsTrigger key={t.value} value={t.value}>
							{t.label}
						</TabsTrigger>
					))}
				</TabsList>
			</div>

			{tab === 'produccion' ? <FiltrosDashboardBar /> : null}

			<TabsContent
				value='pipeline'
				forceMount
				className='data-[state=inactive]:hidden'
			>
				<PanelLayout>{pipeline}</PanelLayout>
			</TabsContent>
			<TabsContent
				value='produccion'
				forceMount
				className='data-[state=inactive]:hidden'
			>
				<PanelLayout>{produccion}</PanelLayout>
			</TabsContent>
		</Tabs>
	)
}
