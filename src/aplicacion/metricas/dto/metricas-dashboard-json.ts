/**
 * Tipos de las respuestas de los endpoints independientes de métricas
 * del dashboard de gerencia (`GET /api/metricas/<metrica>`).
 */
export type FiltrosMetricas = {
	mes?: number
	year?: number
}

export interface ItemValor {
	nombre: string
	valor: number
}

export interface ItemCantidad {
	nombre: string
	cantidad: number
}

export interface TendenciaMes {
	mes: string
	prima_neta: number
}

export interface ActividadTipo {
	tipo: string
	concretadas: number
	pendientes: number
}

export interface ResumenActividades {
	agendadas: number
	concretadas: number
	pendientes: number
	porcentaje_cumplimiento: number
}

export interface PrimaNetaMensualJson {
	total_prima_neta: number
	variacion_mes_anterior: number
	mes_label: string
}

export interface ComisionMensualJson {
	total_comision: number
	mes_label: string
}

export type Tendencia12MesesJson = TendenciaMes[]

export type PrimaPorCompaniaJson = ItemValor[]

export type CompaniaTopJson = {
	nombre: string
	prima_neta: number
} | null

export type PrimaPorEjecutivoJson = ItemValor[]

export type PrimaPorRamoJson = ItemValor[]

export type ActividadesPorTipoJson = ActividadTipo[]

export type ResumenActividadesJson = ResumenActividades

export type PolizasPorComunaJson = ItemCantidad[]

export type PolizasPorSexoJson = ItemCantidad[]

export type PolizasPorRangoEdadJson = ItemCantidad[]

export type PolizasPorRamoJson = ItemCantidad[]

export type PrimaCotizadaJson = {
	prima_cotizada: number
}

export type PrimaPotencialEstimadaJson = {
	prima_potencial_estimada: number
}

export type PrimaEsperadaJson = {
	prima_esperada: number
}

export type ProyeccionPrimaEsperadaItemJson = {
	/** Mes de la fecha estimada de cierre, formato 'YYYY-MM' */
	mes: string
	prima_esperada: number
}

export type ProyeccionPrimaEsperadaJson = ProyeccionPrimaEsperadaItemJson[]
