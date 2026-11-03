import type { ProcesoComercialJson } from './proceso-comercial-json'
import type { EstadoSemaforo } from './tipos'

export interface ReporteProcesoComercial {
	proceso: ProcesoComercialJson
	fecha_ingreso_estado: string | null
	/** Días decimales (fracción de día, horas calendario 24/7). */
	dias_transcurridos: number | null
	porentaje_sla_consumido: number | null
	estado_semaforo: EstadoSemaforo
	/** Días enteros configurados como límite SLA. */
	dias_limite: number | null
	/** Días decimales (fracción de día). */
	dias_restantes: number | null
	/** Días decimales (fracción de día). */
	dias_atraso: number | null
	mensaje_semaforo: string | null
}
