export const CODIGO_LINEA_CONDOMINIOS = 'condominios'
export const CODIGO_LINEAS_PERSONALES = 'lineas_personales'
export const CODIGO_LINEAS_COMERCIALES = 'lineas_comerciales'

export type CodigoLineaNegocio =
	| typeof CODIGO_LINEA_CONDOMINIOS
	| typeof CODIGO_LINEAS_PERSONALES
	| typeof CODIGO_LINEAS_COMERCIALES

type LineaNegocioLike = {
	codigo?: string | null
	nombre: string
}

export function codigoLineaNegocio(linea: LineaNegocioLike): string {
	if (linea.codigo) return linea.codigo

	// Compatibilidad cuando la fila aún no tiene código configurado
	const nombre = linea.nombre.toLowerCase()
	if (nombre === 'condominio') return CODIGO_LINEA_CONDOMINIOS
	if (nombre.includes('personal')) return CODIGO_LINEAS_PERSONALES
	if (nombre.includes('comercial')) return CODIGO_LINEAS_COMERCIALES
	return nombre
}
