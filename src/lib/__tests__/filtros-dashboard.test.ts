import { describe, expect, it } from 'vitest'
import {
	filtrosInicialesDashboard,
	resolverFiltrosDashboard,
} from '../filtros-dashboard'

describe('resolverFiltrosDashboard', () => {
	it('usa mes y year válidos de la URL', () => {
		expect(resolverFiltrosDashboard({ mes: '5', year: '2026' })).toEqual({
			mes: 5,
			year: 2026,
		})
	})

	it('toma el primer valor cuando el parámetro se repite', () => {
		expect(
			resolverFiltrosDashboard({
				mes: ['5', '7'],
				year: ['2026', '2025'],
			}),
		).toEqual({ mes: 5, year: 2026 })
	})

	it('cae al período en curso con parámetros inválidos o ausentes', () => {
		const porDefecto = filtrosInicialesDashboard()

		expect(resolverFiltrosDashboard({ mes: '13', year: 'abc' })).toEqual(
			porDefecto,
		)
		expect(resolverFiltrosDashboard({ mes: '0', year: '1999' })).toEqual(
			porDefecto,
		)
		expect(resolverFiltrosDashboard({})).toEqual(porDefecto)
	})
})
