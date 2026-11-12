import { describe, expect, it } from 'vitest'

import {
	esConsultaInicial,
	filtrosIniciales,
	queryKeySolicitudesPanel,
} from '../query-key-solicitudes-panel'

describe('queryKeySolicitudesPanel', () => {
	it('la consulta inicial calza exactamente con el prefetch SSR', () => {
		expect(queryKeySolicitudesPanel(filtrosIniciales())).toEqual([
			'solicitudes-cotizacion',
			'',
			'',
			'',
			'',
			1,
			15,
		])
	})

	it('incorpora cada filtro en su posición', () => {
		expect(
			queryKeySolicitudesPanel({
				...filtrosIniciales(),
				textoBusqueda: 'torres',
				estado: 'estudios_emitidos',
				rutUsuario: '11111111-1',
				pagina: 2,
				tamanoPagina: 10,
			}),
		).toEqual([
			'solicitudes-cotizacion',
			'torres',
			'estudios_emitidos',
			'',
			'11111111-1',
			2,
			10,
		])
	})
})

describe('esConsultaInicial', () => {
	it('es true solo con los filtros por defecto', () => {
		expect(esConsultaInicial(filtrosIniciales())).toBe(true)
	})

	it('es false ante cualquier filtro o paginación distinta', () => {
		expect(esConsultaInicial({ ...filtrosIniciales(), textoBusqueda: 'x' })).toBe(false)
		expect(esConsultaInicial({ ...filtrosIniciales(), estado: 'estudios_emitidos' })).toBe(false)
		expect(esConsultaInicial({ ...filtrosIniciales(), prioridad: 'alta' })).toBe(false)
		expect(esConsultaInicial({ ...filtrosIniciales(), rutUsuario: '11111111-1' })).toBe(false)
		expect(esConsultaInicial({ ...filtrosIniciales(), pagina: 2 })).toBe(false)
		expect(esConsultaInicial({ ...filtrosIniciales(), tamanoPagina: 10 })).toBe(false)
	})
})
