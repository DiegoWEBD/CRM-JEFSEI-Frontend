import { describe, expect, it } from 'vitest'

import { formatRut } from '../format-rut'

describe('formatRut — formateo visual mientras se escribe', () => {
	it('inserta puntos de miles y el guion antes del dígito verificador', () => {
		expect(formatRut('123456785')).toBe('12.345.678-5')
		expect(formatRut('12345678k')).toBe('12.345.678-K')
	})

	it('a partir de dos caracteres ya inserta el guion, porque el último es el DV', () => {
		expect(formatRut('')).toBe('')
		expect(formatRut('1')).toBe('1')
		expect(formatRut('12')).toBe('1-2')
	})

	it('limpia puntos y guiones previos para no duplicarlos', () => {
		expect(formatRut('12.345.678-5')).toBe('12.345.678-5')
		expect(formatRut('12-345-678-5')).toBe('12.345.678-5')
	})

	it('descarta letras que no sean el dígito verificador K', () => {
		expect(formatRut('12x34y5678z5')).toBe('12.345.678-5')
	})

	it('formatea sin importar el largo: presentar no equivale a validar', () => {
		// Un cuerpo de 7 dígitos también recibe puntos: la validación es otra capa.
		expect(formatRut('1234567-5')).toBe('1.234.567-5')
	})

	it('da formato también a un RUT con dígito verificador erróneo', () => {
		expect(formatRut('999999999')).toBe('99.999.999-9')
		expect(formatRut('000000000')).toBe('00.000.000-0')
	})
})
