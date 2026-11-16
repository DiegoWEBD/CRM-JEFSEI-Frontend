import type { FiltrosMetricas } from '@/aplicacion/metricas/dto/metricas-dashboard-json'

export type FiltrosDashboard = FiltrosMetricas & {
	mes: number
	year: number
}

/**
 * Período inicial del dashboard (mes y año en curso).
 *
 * Se usa tanto en el render de servidor (prefetch de cada tarjeta) como
 * para el estado inicial de `FiltrosDashboardProvider`, de modo que las
 * queryKeys calzen desde el primer render.
 */
export function filtrosInicialesDashboard(): FiltrosDashboard {
	const hoy = new Date()
	return {
		mes: hoy.getMonth() + 1,
		year: hoy.getFullYear(),
	}
}
