/**
 * Pestañas ("páginas") del dashboard de gerencia.
 *
 * El tab activo vive en la URL (`?tab=…`) y se resuelve tanto en el
 * servidor (para prefetch SSR solo de las métricas de la pestaña activa)
 * como en el cliente (para renderizar la pestaña correspondiente).
 */
export type TabDashboard = 'pipeline' | 'produccion'

export const TAB_DASHBOARD_POR_DEFECTO: TabDashboard = 'pipeline'

export function esTabDashboard(
	value: string | null | undefined,
): value is TabDashboard {
	return value === 'pipeline' || value === 'produccion'
}

export function resolverTabDashboard(
	value: string | string[] | null | undefined,
): TabDashboard {
	const raw = Array.isArray(value) ? value[0] : value
	return esTabDashboard(raw) ? raw : TAB_DASHBOARD_POR_DEFECTO
}
