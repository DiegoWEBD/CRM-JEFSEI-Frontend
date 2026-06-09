import { ProcesoComercialResumenJson } from '@/aplicacion/procesos-comerciales/dto/proceso-comercial-resumen-json'

export interface ProspectoResumenJson {
	id: number
	id_cliente?: number
	nombre_riesgo: string
	nombre_administrador?: string
	linea_negocio: string
	ejecutivo_comercial?: string
	procesos_comerciales: ProcesoComercialResumenJson[]
}
