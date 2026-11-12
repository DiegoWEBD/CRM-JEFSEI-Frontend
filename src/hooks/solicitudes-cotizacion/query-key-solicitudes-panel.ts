/**
 * Fuente única de la queryKey y los filtros del panel de solicitudes de
 * cotización. La usan el hook del cliente y el prefetch SSR
 * (`panel-solicitudes-estudio-inner.tsx`): sus valores deben calzar
 * exactamente (orden, tipos y valores) o la hidratación no se aprovecharía y
 * se dispararía un segundo fetch.
 */

export const TAMANO_PAGINA = 10

export type FiltrosSolicitudesCotizacion = {
	textoBusqueda: string
	estado: string
	prioridad: string
	rutUsuario: string
	pagina: number
	tamanoPagina: number
}

export const filtrosIniciales = (): FiltrosSolicitudesCotizacion => ({
	textoBusqueda: '',
	estado: '',
	prioridad: '',
	rutUsuario: '',
	pagina: 1,
	tamanoPagina: TAMANO_PAGINA,
})

export const queryKeySolicitudesPanel = (filtros: FiltrosSolicitudesCotizacion) =>
	[
		'solicitudes-cotizacion',
		filtros.textoBusqueda,
		filtros.estado,
		filtros.prioridad,
		filtros.rutUsuario,
		filtros.pagina,
		filtros.tamanoPagina,
	] as const

export const esConsultaInicial = (filtros: FiltrosSolicitudesCotizacion) =>
	filtros.textoBusqueda === '' &&
	filtros.estado === '' &&
	filtros.prioridad === '' &&
	filtros.rutUsuario === '' &&
	filtros.pagina === 1 &&
	filtros.tamanoPagina === TAMANO_PAGINA
