export const CODIGO_LINEA_CONDOMINIOS = 'condominios'
export const CODIGO_LINEAS_PERSONALES = 'lineas_personales'
export const CODIGO_LINEAS_COMERCIALES = 'lineas_comerciales'

export type CodigoLineaNegocio =
	| typeof CODIGO_LINEA_CONDOMINIOS
	| typeof CODIGO_LINEAS_PERSONALES
	| typeof CODIGO_LINEAS_COMERCIALES
