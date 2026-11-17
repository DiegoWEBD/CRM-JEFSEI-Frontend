import type { FiltrosMetricas } from '@/aplicacion/metricas/dto/metricas-dashboard-json'

/**
 * Claves de query de cada métrica del dashboard de gerencia.
 *
 * Deben calzar exactamente entre el prefetch del server (tarjeta server)
 * y los hooks del cliente para que la hidratación sea efectiva y no se
 * dispare un segundo fetch.
 */
export const clavePrimaNetaMensual = (filtros: FiltrosMetricas) =>
	['metricas', 'prima-neta-mensual', filtros] as const

export const claveComisionMensual = (filtros: FiltrosMetricas) =>
	['metricas', 'comision-mensual', filtros] as const

export const claveTendenciaAnual = (filtros: FiltrosMetricas) =>
	['metricas', 'tendencia-anual', filtros] as const

export const clavePrimaPorCompania = (filtros: FiltrosMetricas) =>
	['metricas', 'prima-por-compania', filtros] as const

export const claveCompaniaTop = (filtros: FiltrosMetricas) =>
	['metricas', 'compania-top', filtros] as const

export const clavePrimaPorEjecutivo = (filtros: FiltrosMetricas) =>
	['metricas', 'prima-por-ejecutivo', filtros] as const

export const clavePrimaPorRamo = (filtros: FiltrosMetricas) =>
	['metricas', 'prima-por-ramo', filtros] as const

export const claveActividadesPorTipo = (filtros: FiltrosMetricas) =>
	['metricas', 'actividades-por-tipo', filtros] as const

export const claveResumenActividades = (filtros: FiltrosMetricas) =>
	['metricas', 'resumen-actividades', filtros] as const

export const clavePolizasPorComuna = (filtros: FiltrosMetricas) =>
	['metricas', 'polizas-por-comuna', filtros] as const

export const clavePolizasPorSexo = (filtros: FiltrosMetricas) =>
	['metricas', 'polizas-por-sexo', filtros] as const

export const clavePolizasPorRangoEdad = (filtros: FiltrosMetricas) =>
	['metricas', 'polizas-por-rango-edad', filtros] as const

export const clavePolizasPorRamo = (filtros: FiltrosMetricas) =>
	['metricas', 'polizas-por-ramo', filtros] as const

/**
 * Métricas de pipeline de oportunidades: no dependen de mes/año, por lo que
 * sus claves no llevan filtros y no refetchean al cambiar los selects.
 */
export const clavePrimaCotizada = () => ['metricas', 'prima-cotizada'] as const

export const clavePrimaPotencialEstimada = () =>
	['metricas', 'prima-potencial-estimada'] as const

export const clavePrimaEsperada = () => ['metricas', 'prima-esperada'] as const

export const claveProyeccionPrimaEsperada = () =>
	['metricas', 'proyeccion-prima-esperada'] as const

export const claveTasaCierre = () => ['metricas', 'tasa-cierre'] as const
