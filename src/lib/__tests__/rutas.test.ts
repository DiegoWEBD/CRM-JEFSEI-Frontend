import { describe, expect, it } from 'vitest'

import { destinoSeguro, esRutaPublica, urlLoginConDestino } from '@/lib/rutas'

describe('destinoSeguro — validación de ?next=', () => {
	it('acepta rutas internas, con query incluida', () => {
		expect(destinoSeguro('/polizas')).toBe('/polizas')
		expect(destinoSeguro('/prospectos?estado=nuevo')).toBe('/prospectos?estado=nuevo')
		expect(destinoSeguro('/polizas/123.456')).toBe('/polizas/123.456')
	})

	it('descarta URLs absolutas y rutas de protocolo relativo (open redirect)', () => {
		expect(destinoSeguro('https://evil.example/robar')).toBeNull()
		expect(destinoSeguro('http://evil.example/robar')).toBeNull()
		expect(destinoSeguro('//evil.example/robar')).toBeNull()
		expect(destinoSeguro('/\\evil.example/robar')).toBeNull()
	})

	it('descarta vacíos y nulos', () => {
		expect(destinoSeguro(null)).toBeNull()
		expect(destinoSeguro(undefined)).toBeNull()
		expect(destinoSeguro('')).toBeNull()
	})

	it('descarta rutas públicas para no redirigir en bucle', () => {
		expect(destinoSeguro('/login')).toBeNull()
		expect(destinoSeguro('/login?next=/polizas')).toBeNull()
	})
})

describe('urlLoginConDestino', () => {
	it('conserva la ruta original en ?next=', () => {
		expect(urlLoginConDestino('/prospectos', '?estado=nuevo')).toBe(
			'/login?next=%2Fprospectos%3Festado%3Dnuevo',
		)
		expect(urlLoginConDestino('/prospectos')).toBe('/login?next=%2Fprospectos')
	})

	it('sin destino útil va a /login sin next', () => {
		expect(urlLoginConDestino('/')).toBe('/login')
		expect(urlLoginConDestino('/login')).toBe('/login')
	})
})

describe('esRutaPublica', () => {
	it('solo /login es pública: el resto de rutas exigen sesión', () => {
		expect(esRutaPublica('/login')).toBe(true)
		expect(esRutaPublica('/')).toBe(false)
		expect(esRutaPublica('/prospectos')).toBe(false)
	})
})
