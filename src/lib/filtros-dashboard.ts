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

/**
 * Resuelve el período del dashboard desde los search params de la URL
 * (`?mes=…&year=…`). Valida el rango (mes 1-12, year ≥ 2000) y cae al
 * período en curso si el parámetro falta o es inválido.
 */
export function resolverFiltrosDashboard(params: {
	mes?: string | string[] | null
	year?: string | string[] | null
}): FiltrosDashboard {
	const porDefecto = filtrosInicialesDashboard()
	const mes = Number(Array.isArray(params.mes) ? params.mes[0] : params.mes)
	const year = Number(Array.isArray(params.year) ? params.year[0] : params.year)

	return {
		mes: Number.isInteger(mes) && mes >= 1 && mes <= 12 ? mes : porDefecto.mes,
		year: Number.isInteger(year) && year >= 2000 ? year : porDefecto.year,
	}
}
