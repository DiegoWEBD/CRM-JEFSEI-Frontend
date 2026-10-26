import { describe, expect, it } from 'vitest'

import { formatUfAmount, formatUF, toSafeNumber } from '@/lib/uf'
import { formatearProrrateoPorcentaje } from '@/utils/formatear-prorrateo'

describe('toSafeNumber — valores que llegan del backend', () => {
	it('convierte null en 0 en lugar de propagar un nulo al cálculo', () => {
		expect(toSafeNumber(null)).toBe(0)
	})

	it('convierte texto numérico a número', () => {
		expect(toSafeNumber('1500.5')).toBe(1500.5)
		expect(toSafeNumber(0)).toBe(0)
	})

	it('devuelve 0 ante valores no numéricos', () => {
		expect(toSafeNumber('no-es-numero')).toBe(0)
		expect(toSafeNumber(undefined)).toBe(0)
		expect(toSafeNumber(Number.NaN)).toBe(0)
		expect(toSafeNumber(Number.POSITIVE_INFINITY)).toBe(0)
	})
})

describe('formatUfAmount — presentación de montos UF', () => {
	it('muestra el monto con separador de miles y coma decimal', () => {
		expect(formatUfAmount(1234.56)).toBe('1.234,56 UF')
		expect(formatUfAmount(1234567.89)).toBe('1.234.567,89 UF')
		expect(formatUfAmount(7)).toBe('7 UF')
	})

	it('muestra 0 UF para el valor cero, sin decimales colgando', () => {
		expect(formatUfAmount(0)).toBe('0 UF')
	})

	it('no redondea los decimales: el monto mostrado es el recibido', () => {
		expect(formatUfAmount(0.1)).toBe('0,1 UF')
		expect(formatUfAmount(1.23456789)).toBe('1,23456789 UF')
		expect(formatUfAmount(0.0085)).toBe('0,0085 UF')
		expect(formatUfAmount(1234.5)).toBe('1.234,5 UF')
	})

	it('formatUF trata null como 0', () => {
		expect(formatUF(null)).toBe('0 UF')
		expect(formatUF(2500)).toBe('2.500 UF')
	})
})

describe('formatearProrrateoPorcentaje — alícuotas de condominio', () => {
	it('convierte la fracción del todo en porcentaje legible', () => {
		// El prorrateo se guarda como fracción: 0,0085 equivale a 0,85 %.
		expect(formatearProrrateoPorcentaje(0.0085)).toBe('0.85 %')
		expect(formatearProrrateoPorcentaje(1)).toBe('100 %')
		expect(formatearProrrateoPorcentaje(0.5)).toBe('50 %')
	})

	it('muestra 0 % para unidades sin prorrateo', () => {
		expect(formatearProrrateoPorcentaje(0)).toBe('0 %')
	})

	it('recorta el ruido de coma flotante sin perder precisión comercial', () => {
		// 0.001 * 100 = 0.10000000000000002 en coma flotante.
		expect(formatearProrrateoPorcentaje(0.001)).toBe('0.1 %')
		expect(formatearProrrateoPorcentaje(0.123456789)).toBe('12.345679 %')
	})
})
