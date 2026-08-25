import type { ProcesoComercialJson } from './proceso-comercial-json'
import type { EstadoSemaforo } from './tipos'

export interface ReporteProcesoComercial {
	proceso: ProcesoComercialJson
	fecha_ingreso_etapa: string
	dias_transcurridos: number
	porentaje_sla_consumido: number
	estado_semaforo: EstadoSemaforo
	dias_restantes: number
	dias_atraso: number
	mensaje_semaforo: string
}
