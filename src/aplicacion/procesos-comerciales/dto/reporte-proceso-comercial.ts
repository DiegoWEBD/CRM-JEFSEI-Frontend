import type { ProcesoComercialJson } from './proceso-comercial-json'
import type { EstadoSemaforo } from './tipos'

export interface ReporteProcesoComercial {
	proceso: ProcesoComercialJson
	fecha_ingreso_estado: string | null
	dias_transcurridos: number | null
	porentaje_sla_consumido: number | null
	estado_semaforo: EstadoSemaforo
	dias_limite: number | null
	dias_restantes: number | null
	dias_atraso: number | null
	mensaje_semaforo: string | null
}
