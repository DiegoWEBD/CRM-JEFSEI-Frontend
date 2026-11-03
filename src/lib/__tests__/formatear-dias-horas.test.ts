import { describe, expect, it } from 'vitest'

import { formatearDiasHoras } from '@/lib/formatos/formatear-dias-horas'

describe('formatearDiasHoras', () => {
	it('muestra días y horas de un decimal', () => {
		expect(formatearDiasHoras(0.5417)).toBe('0 días 13 h')
	})

	it('usa singular para un día', () => {
		expect(formatearDiasHoras(1.25)).toBe('1 día 6 h')
	})

	it('omite las horas cuando son 0', () => {
		expect(formatearDiasHoras(10)).toBe('10 días')
		expect(formatearDiasHoras(1)).toBe('1 día')
		expect(formatearDiasHoras(0)).toBe('0 días')
	})

	it('redondea las horas hacia abajo', () => {
		// 13 h 59 min no llega a 14 h.
		expect(formatearDiasHoras(13.99 / 24)).toBe('0 días 13 h')
	})

	it('muestra un guion sin valor', () => {
		expect(formatearDiasHoras(null)).toBe('—')
		expect(formatearDiasHoras(undefined)).toBe('—')
	})
})
