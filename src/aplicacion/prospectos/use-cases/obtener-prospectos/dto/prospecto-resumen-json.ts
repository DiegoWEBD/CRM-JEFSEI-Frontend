export interface OportunidadesContadoresJson {
	comerciales: number
	renovaciones: number
}

export interface ProspectoResumenJson {
	id: number
	id_cliente?: number
	rut_riesgo: string
	nombre_riesgo: string
	nombre_fantasia?: string
	nombre_administrador?: string
	linea_negocio: string
	ejecutivo_comercial?: string
	oportunidades: OportunidadesContadoresJson
	estado_general_cliente: string
	comuna: string
}
