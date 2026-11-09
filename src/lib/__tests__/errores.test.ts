import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'

import {
	DIGEST_SIN_PERMISOS,
	esErrorSinPermisos,
	marcarErrorSinPermisos,
} from '../errores'

function errorDeBackend(status: number, data: unknown = {}): AxiosError {
	const config = { url: '/api/prospectos' } as AxiosRequestConfig as AxiosResponse['config']
	const response: AxiosResponse = {
		data,
		status,
		statusText: '',
		headers: {},
		config,
		request: null,
	}
	return new AxiosError('Request failed', String(status), config, null, response)
}

describe('marcarErrorSinPermisos', () => {
	it('estampa el digest de "sin permisos" sobre el mismo error, sin reemplazarlo', () => {
		const original = errorDeBackend(403)

		const resultado = marcarErrorSinPermisos(original)

		expect(resultado).toBe(original)
		expect(resultado.digest).toBe(DIGEST_SIN_PERMISOS)
		// El AxiosError se conserva completo para el BFF y los consumidores de response.
		expect(resultado.response?.status).toBe(403)
	})
})

describe('esErrorSinPermisos', () => {
	it('reconoce un 403 de axios, esté marcado o no', () => {
		expect(esErrorSinPermisos(errorDeBackend(403))).toBe(true)
		expect(esErrorSinPermisos(marcarErrorSinPermisos(errorDeBackend(403)))).toBe(true)
	})

	it('reconoce el error serializado que llega a error.tsx desde un Server Component', () => {
		// En producción el error de SSR llega como Error plano: solo sobrevive `digest`.
		const serializado = Object.assign(new Error('Request failed with status code 403'), {
			digest: DIGEST_SIN_PERMISOS,
		})

		expect(esErrorSinPermisos(serializado)).toBe(true)
	})

	it('no toma por falta de permisos otros status de axios', () => {
		expect(esErrorSinPermisos(errorDeBackend(401))).toBe(false)
		expect(esErrorSinPermisos(errorDeBackend(500))).toBe(false)
		expect(esErrorSinPermisos(new AxiosError('Network Error', 'ERR_NETWORK'))).toBe(false)
	})

	it('no toma por falta de permisos errores comunes ni valores arbitrarios', () => {
		expect(esErrorSinPermisos(new Error('boom'))).toBe(false)
		expect(esErrorSinPermisos({ digest: 'OTRO_DIGEST' })).toBe(false)
		expect(esErrorSinPermisos({})).toBe(false)
		expect(esErrorSinPermisos('SIN_PERMISOS')).toBe(false)
		expect(esErrorSinPermisos(null)).toBe(false)
		expect(esErrorSinPermisos(undefined)).toBe(false)
	})
})
