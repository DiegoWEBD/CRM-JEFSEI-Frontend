import { describe, expect, it } from 'vitest'

import {
	rutChilenoCalcularDv,
	rutChilenoEstadoValidacion,
	rutChilenoEsValido,
	rutChilenoFormatearVisual,
} from '../validar-rut'

describe('rutChilenoCalcularDv — dígito verificador (regla módulo 11)', () => {
	it('calcula el DV de un cuerpo de 8 dígitos', () => {
		expect(rutChilenoCalcularDv('12345678')).toBe('5')
		expect(rutChilenoCalcularDv('11111111')).toBe('1')
		expect(rutChilenoCalcularDv('55555555')).toBe('5')
	})

	it('usa 0 cuando el resto produce dígito 11', () => {
		// suma 0 → 11 - 0 = 11 → '0'
		expect(rutChilenoCalcularDv('00000000')).toBe('0')
	})

	it('usa K cuando el resto produce dígito 10', () => {
		// suma 12 → 12 % 11 = 1 → 11 - 1 = 10 → 'K'
		expect(rutChilenoCalcularDv('00000040')).toBe('K')
	})

	it('rechaza cuerpos que no sean exactamente 8 dígitos', () => {
		expect(rutChilenoCalcularDv('1234567')).toBe('')
		expect(rutChilenoCalcularDv('123456789')).toBe('')
		expect(rutChilenoCalcularDv('')).toBe('')
		expect(rutChilenoCalcularDv('1234567a')).toBe('')
	})
})

describe('rutChilenoEstadoValidacion — clasificación del valor ingresado', () => {
	it('marca como válido un RUT con formato de puntos y guion', () => {
		expect(rutChilenoEstadoValidacion('12.345.678-5')).toBe('valido')
		expect(rutChilenoEstadoValidacion('11.111.111-1')).toBe('valido')
		expect(rutChilenoEstadoValidacion('00.000.040-K')).toBe('valido')
	})

	it('acepta el RUT sin puntos ni guion', () => {
		expect(rutChilenoEstadoValidacion('123456785')).toBe('valido')
	})

	it('distingue vacío de incompleto', () => {
		expect(rutChilenoEstadoValidacion('')).toBe('vacio')
		expect(rutChilenoEstadoValidacion(undefined)).toBe('vacio')
		expect(rutChilenoEstadoValidacion('   ')).toBe('vacio')
		expect(rutChilenoEstadoValidacion('123')).toBe('incompleto')
	})

	it('separa formato inválido de dígito verificador inválido', () => {
		// Más de 9 caracteres útiles → fuera del formato admitido
		expect(rutChilenoEstadoValidacion('1234567890')).toBe('formato_invalido')
		// El cuerpo debe ser numérico: una K en el cuerpo invalida el formato
		expect(rutChilenoEstadoValidacion('1234567K5')).toBe('formato_invalido')
		// Formato correcto pero el DV no corresponde al cuerpo
		expect(rutChilenoEstadoValidacion('12.345.678-6')).toBe('dv_invalido')
	})

	it('descarta los caracteres que no son dígitos antes de clasificar', () => {
		// Las letras y símbolos se eliminan: lo que queda se evalúa por su largo.
		expect(rutChilenoEstadoValidacion('abcd1234-5')).toBe('incompleto')
		expect(rutChilenoEstadoValidacion('12.345.678-?')).toBe('incompleto')
	})

	it('normaliza los guiones tipográficos que llegan de copiar/pegar', () => {
		// guion en dash, em dash y minus
		expect(rutChilenoEstadoValidacion('12.345.678–5')).toBe('valido')
		expect(rutChilenoEstadoValidacion('12.345.678—5')).toBe('valido')
		expect(rutChilenoEstadoValidacion('12.345.678−5')).toBe('valido')
	})

	it('descarta caracteres de ancho cero que ocultan el valor real', () => {
		expect(rutChilenoEstadoValidacion('12.345.678-\u200B5')).toBe('valido')
		expect(rutChilenoEstadoValidacion('\u200D12.345.678-5')).toBe('valido')
	})

	it('el DV es insensible a mayúsculas/minúsculas', () => {
		expect(rutChilenoEstadoValidacion('00.000.040-k')).toBe('valido')
		expect(rutChilenoEstadoValidacion('00.000.040-K')).toBe('valido')
	})

	it('rutChilenoEsValido coincide con el estado válido', () => {
		expect(rutChilenoEsValido('12.345.678-5')).toBe(true)
		expect(rutChilenoEsValido('12.345.678-6')).toBe(false)
		expect(rutChilenoEsValido('')).toBe(false)
	})
})

describe('rutChilenoFormatearVisual — presentación', () => {
	it('da formato XX.XXX.XXX-Y cuando el RUT es válido', () => {
		expect(rutChilenoFormatearVisual('123456785')).toBe('12.345.678-5')
		expect(rutChilenoFormatearVisual('12.345.678-5')).toBe('12.345.678-5')
		expect(rutChilenoFormatearVisual('00000040K')).toBe('00.000.040-K')
	})

	it('no inventa un formato para valores inválidos', () => {
		expect(rutChilenoFormatearVisual('123456786')).toBe('123456786')
		expect(rutChilenoFormatearVisual('12.345.678-6')).toBe('12.345.678-6')
		expect(rutChilenoFormatearVisual('abc')).toBe('abc')
	})

	it('un RUT de otro largo no se formatea como si fuera válido', () => {
		// 7 dígitos + DV: no cumple el formato de 8 de cuerpo.
		expect(rutChilenoFormatearVisual('1234567-5')).toBe('1234567-5')
	})
})
