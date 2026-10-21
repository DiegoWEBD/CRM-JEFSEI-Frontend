export type EstadoConfiguracion = {
	codigo: string
	nombre: string
	codigo_etapa: string
	nombre_etapa: string
	/** 0..1 */
	probabilidad_cierre: number
	rol_responsable: string | null
	nombre_rol_responsable: string | null
	cantidad_transiciones: number
}

/**
 * Grupo de estados que pertenecen a la misma etapa del proceso comercial.
 *
 * El backend entrega las etapas ya ordenadas (según `EtapaProcesoComercial.orden`)
 * y, dentro de cada una, los estados por probabilidad de cierre ascendente.
 */
export type EtapaConfiguracion = {
	codigo_etapa: string
	nombre_etapa: string
	estados: EstadoConfiguracion[]
}

export type ObtenerEstadosConfiguracionResponse = {
	data: EtapaConfiguracion[]
}
