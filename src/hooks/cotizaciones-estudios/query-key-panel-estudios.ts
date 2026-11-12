/**
 * Fuente única de la queryKey y los filtros del panel de cotizaciones y
 * estudios. La usan el hook del cliente y el prefetch SSR
 * (`panel-inner.tsx`): sus valores deben calzar exactamente (orden, tipos y
 * valores) o la hidratación no se aprovecharía y se dispararía un segundo
 * fetch.
 */

export const TAMANO_PAGINA = 10

export type FiltrosPanelEstudios = {
	textoBusqueda: string
	estado: string
	prioridad: string
	rutEjecutivo: string
	pagina: number
	tamanoPagina: number
}

export const filtrosIniciales = (): FiltrosPanelEstudios => ({
	textoBusqueda: '',
	estado: '',
	prioridad: '',
	rutEjecutivo: '',
	pagina: 1,
	tamanoPagina: TAMANO_PAGINA,
})

export const queryKeyPanelEstudios = (filtros: FiltrosPanelEstudios) =>
	[
		'panel-estudios',
		filtros.textoBusqueda,
		filtros.estado,
		filtros.prioridad,
		filtros.rutEjecutivo,
		filtros.pagina,
		filtros.tamanoPagina,
	] as const

export const esConsultaInicial = (filtros: FiltrosPanelEstudios) =>
	filtros.textoBusqueda === '' &&
	filtros.estado === '' &&
	filtros.prioridad === '' &&
	filtros.rutEjecutivo === '' &&
	filtros.pagina === 1 &&
	filtros.tamanoPagina === TAMANO_PAGINA
