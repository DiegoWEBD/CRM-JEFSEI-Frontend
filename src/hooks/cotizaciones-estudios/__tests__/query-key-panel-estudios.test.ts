import { describe, expect, it } from 'vitest'

import {
	esConsultaInicial,
	filtrosIniciales,
	queryKeyPanelEstudios,
} from '../query-key-panel-estudios'

describe('queryKeyPanelEstudios', () => {
	it('la consulta inicial calza exactamente con el prefetch SSR', () => {
		expect(queryKeyPanelEstudios(filtrosIniciales())).toEqual([
			'panel-estudios',
			'',
			'',
			'',
			'',
			1,
			10,
		])
	})

	it('incorpora cada filtro en su posición', () => {
		expect(
			queryKeyPanelEstudios({
				...filtrosIniciales(),
				textoBusqueda: 'torres',
				estado: 'cotizaciones_vigentes',
				rutEjecutivo: '11111111-1',
				pagina: 2,
				tamanoPagina: 10,
			}),
		).toEqual([
			'panel-estudios',
			'torres',
			'cotizaciones_vigentes',
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
		expect(
			esConsultaInicial({ ...filtrosIniciales(), estado: 'estudios_emitidos' }),
		).toBe(false)
		expect(esConsultaInicial({ ...filtrosIniciales(), prioridad: 'alta' })).toBe(false)
		expect(esConsultaInicial({ ...filtrosIniciales(), rutEjecutivo: '11111111-1' })).toBe(false)
		expect(esConsultaInicial({ ...filtrosIniciales(), pagina: 2 })).toBe(false)
		expect(esConsultaInicial({ ...filtrosIniciales(), tamanoPagina: 25 })).toBe(false)
	})
})
