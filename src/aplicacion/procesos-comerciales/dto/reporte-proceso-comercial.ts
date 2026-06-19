import type { ProcesoComercialJson } from './proceso-comercial-json'
import type { EstadoSemaforo } from './tipos'

export interface ReporteProcesoComercialAbierto {
	proceso: ProcesoComercialJson
	fecha_ingreso_etapa: string
	dias_transcurridos: number
	porentaje_sla_consumido: number
	estado_semaforo: EstadoSemaforo
	dias_restantes: number
	dias_atraso: number
	mensaje_semaforo: string
}

export interface ReporteProcesoComercialCerrado {
	proceso: ProcesoComercialJson
	estado_semaforo: 'NO_APLICA'
}

export type ReporteProcesoComercial =
	| ReporteProcesoComercialAbierto
	| ReporteProcesoComercialCerrado
