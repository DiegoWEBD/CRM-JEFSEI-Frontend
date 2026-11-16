import { cache } from 'react'
import { obtenerActividadesPorTipo } from './use-cases/obtener-actividades-por-tipo/obtener-actividades-por-tipo'
import { obtenerComisionMensual } from './use-cases/obtener-comision-mensual/obtener-comision-mensual'
import { obtenerCompaniaTop } from './use-cases/obtener-compania-top/obtener-compania-top'
import { obtenerPolizasPorComuna } from './use-cases/obtener-polizas-por-comuna/obtener-polizas-por-comuna'
import { obtenerPolizasPorRamo } from './use-cases/obtener-polizas-por-ramo/obtener-polizas-por-ramo'
import { obtenerPolizasPorRangoEdad } from './use-cases/obtener-polizas-por-rango-edad/obtener-polizas-por-rango-edad'
import { obtenerPolizasPorSexo } from './use-cases/obtener-polizas-por-sexo/obtener-polizas-por-sexo'
import { obtenerPrimaCotizada } from './use-cases/obtener-prima-cotizada/obtener-prima-cotizada'
import { obtenerPrimaEsperada } from './use-cases/obtener-prima-esperada/obtener-prima-esperada'
import { obtenerPrimaNetaMensual } from './use-cases/obtener-prima-neta-mensual/obtener-prima-neta-mensual'
import { obtenerPrimaPorCompania } from './use-cases/obtener-prima-por-compania/obtener-prima-por-compania'
import { obtenerPrimaPorEjecutivo } from './use-cases/obtener-prima-por-ejecutivo/obtener-prima-por-ejecutivo'
import { obtenerPrimaPorRamo } from './use-cases/obtener-prima-por-ramo/obtener-prima-por-ramo'
import { obtenerPrimaPotencialEstimada } from './use-cases/obtener-prima-potencial-estimada/obtener-prima-potencial-estimada'
import { obtenerProyeccionPrimaEsperada } from './use-cases/obtener-proyeccion-prima-esperada/obtener-proyeccion-prima-esperada'
import { obtenerResumenActividades } from './use-cases/obtener-resumen-actividades/obtener-resumen-actividades'
import { obtenerTendencia12Meses } from './use-cases/obtener-tendencia-12-meses/obtener-tendencia-12-meses'

/**
 * Versiones con dedupe por request de los use cases de métricas, para que
 * el prefetch de las tarjetas server que comparten métrica (p. ej. los
 * donuts y la tarjeta de análisis) no repita la consulta al backend.
 *
 * Solo deben usarlas los componentes de servidor; las rutas BFF llaman a
 * los use cases directamente.
 */
export const consultarPrimaNetaMensual = cache(obtenerPrimaNetaMensual)
export const consultarComisionMensual = cache(obtenerComisionMensual)
export const consultarTendencia12Meses = cache(obtenerTendencia12Meses)
export const consultarPrimaPorCompania = cache(obtenerPrimaPorCompania)
export const consultarCompaniaTop = cache(obtenerCompaniaTop)
export const consultarPrimaPorEjecutivo = cache(obtenerPrimaPorEjecutivo)
export const consultarPrimaPorRamo = cache(obtenerPrimaPorRamo)
export const consultarActividadesPorTipo = cache(obtenerActividadesPorTipo)
export const consultarResumenActividades = cache(obtenerResumenActividades)
export const consultarPolizasPorComuna = cache(obtenerPolizasPorComuna)
export const consultarPolizasPorSexo = cache(obtenerPolizasPorSexo)
export const consultarPolizasPorRangoEdad = cache(obtenerPolizasPorRangoEdad)
export const consultarPolizasPorRamo = cache(obtenerPolizasPorRamo)
export const consultarPrimaCotizada = cache(obtenerPrimaCotizada)
export const consultarPrimaPotencialEstimada = cache(obtenerPrimaPotencialEstimada)
export const consultarPrimaEsperada = cache(obtenerPrimaEsperada)
export const consultarProyeccionPrimaEsperada = cache(obtenerProyeccionPrimaEsperada)
