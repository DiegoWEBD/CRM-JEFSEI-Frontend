export interface FiltrosProcesosComerciales {
	texto_busqueda?: string | null
	ejecutivos?: string[] | null
	etapas?: string[] | null
	estado_semaforo?: string[] | null
	estado_proceso?: string | null
	cerrado?: boolean | null
	fecha_desde?: string | null
	fecha_hasta?: string | null
	pagina?: number
	tamano_pagina?: number
}
