'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/tabs'
import { resolverTabDashboard, type TabDashboard } from '@/lib/tab-dashboard'
import { useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import FiltrosDashboardBar from './filtros-dashboard-bar'

const TABS: { value: TabDashboard; label: string }[] = [
	{ value: 'pipeline', label: 'Pipeline comercial' },
	{ value: 'produccion', label: 'Producción comercial' },
]

/**
 * Pestañas del dashboard de gerencia ("páginas" del informe).
 *
 * El tab activo vive en la URL (`?tab=…`, por defecto `pipeline`) y se
 * actualiza con `replaceState` (routing superficial): cambiar de pestaña
 * no dispara un roundtrip al servidor ni re-prefetchea las métricas.
 *
 * Solo se monta el contenido de la pestaña activa: las métricas de la
 * otra pestaña se fetchean en cliente al cambiar a ella (sus tarjetas se
 * renderizaron sin prefetch SSR desde `PanelDashboard`). Como contraparte,
 * al cambiar de pestaña no se conserva el estado de UI de la anterior (el
 * caché de React Query evita refetch dentro de su `staleTime`).
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
	const tab = resolverTabDashboard(searchParams.get('tab'))

	const cambiarTab = (value: string) => {
		window.history.replaceState(null, '', `?tab=${value}`)
	}

	return (
		<Tabs value={tab} onValueChange={cambiarTab} className='gap-0'>
			<div className='-mx-3 border-b border-border/60 px-3 pb-3 pt-2.5 lg:-mx-8 lg:px-8'>
				<TabsList>
					{TABS.map(t => (
						<TabsTrigger key={t.value} value={t.value}>
							{t.label}
						</TabsTrigger>
					))}
				</TabsList>
			</div>

			{tab === 'produccion' ? <FiltrosDashboardBar /> : null}

			<div className='grid gap-8'>
				{tab === 'pipeline' ? pipeline : produccion}
			</div>
		</Tabs>
	)
}
