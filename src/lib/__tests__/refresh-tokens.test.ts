// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	cookieOptionsRefresh,
	cookieOptionsToken,
	decodificarAccessToken,
	refrescarTokensEnBackend,
} from '@/lib/refresh-tokens'
import { tokenSesion } from '@/test/fixtures/sesion'
import { simularFetch, type FetchSimulado } from '@/test/helpers/fetch-simulado'

let fetchSimulado: FetchSimulado

beforeEach(() => {
	fetchSimulado = simularFetch(() => ({
		status: 200,
		json: {
			access_token: tokenSesion({ enSegundos: 600 }),
			refresh_token: 'refresh-rotado',
			expire_minutes: 10,
		},
	}))
})

describe('refrescarTokensEnBackend — rotación contra el backend', () => {
	it('devuelve los nuevos tokens cuando el backend acepta el refresh', async () => {
		const resultado = await refrescarTokensEnBackend('refresh-original')

		expect(resultado).not.toBeNull()
		expect(resultado?.expire_minutes).toBe(10)
		expect(fetchSimulado.llamadas[0]!.body).toEqual({ refresh_token: 'refresh-original' })
	})

	it('devuelve null cuando el backend rechaza el refresh token', async () => {
		fetchSimulado.restaurar()
		fetchSimulado = simularFetch(() => ({ status: 401, json: {} }))

		expect(await refrescarTokensEnBackend('refresh-reusado')).toBeNull()
	})

	it('devuelve null cuando el backend no responde', async () => {
		fetchSimulado.restaurar()
		fetchSimulado = simularFetch(() => {
			throw new Error('network down')
		})

		expect(await refrescarTokensEnBackend('refresh')).toBeNull()
	})

	it('no intenta rotar nada si no hay URL de backend configurada', async () => {
		const original = process.env.API_URL
		process.env.API_URL = ''
		try {
			expect(await refrescarTokensEnBackend('refresh')).toBeNull()
			expect(fetchSimulado.llamadas).toHaveLength(0)
		} finally {
			process.env.API_URL = original
		}
	})
})

describe('decodificarAccessToken — lectura de claims tras el refresh', () => {
	it('extrae el payload del JWT sin verificar la firma', () => {
		const payload = decodificarAccessToken(tokenSesion({ rut: '11.111.111-1' }))

		expect(payload?.rut).toBe('11.111.111-1')
		expect(payload?.codigo_roles).toEqual(['EJECUTIVO_COMERCIAL'])
	})

	it('conserva los códigos de permiso que llegan del backend', () => {
		const payload = decodificarAccessToken(
			tokenSesion({ codigo_permisos: ['CANCELAR_POLIZA', 'REACTIVAR_POLIZA'] }),
		)

		expect(payload?.codigo_permisos).toEqual(['CANCELAR_POLIZA', 'REACTIVAR_POLIZA'])
	})

	it('devuelve null ante un token ilegible, en lugar de lanzar', () => {
		expect(decodificarAccessToken('no.es-un.jwt')).toBeNull()
		expect(decodificarAccessToken('')).toBeNull()
	})
})

describe('opciones de las cookies de autenticación', () => {
	it('el access token se emite httpOnly para que el JS del navegador no lo lea', () => {
		const opciones = cookieOptionsToken(15)

		expect(opciones.httpOnly).toBe(true)
		expect(opciones.sameSite).toBe('lax')
		expect(opciones.path).toBe('/')
		expect(opciones.maxAge).toBe(15 * 60)
	})

	it('el refresh token se emite httpOnly y con expiración acotada a 30 días', () => {
		const opciones = cookieOptionsRefresh()

		expect(opciones.httpOnly).toBe(true)
		expect(opciones.sameSite).toBe('lax')
		expect(opciones.path).toBe('/')
		expect(opciones.maxAge).toBe(30 * 24 * 60 * 60)
	})

	it('ambas cookies marcan Secure solo en producción', () => {
		try {
			vi.stubEnv('NODE_ENV', 'production')
			expect(cookieOptionsToken(1).secure).toBe(true)
			expect(cookieOptionsRefresh().secure).toBe(true)

			vi.stubEnv('NODE_ENV', 'test')
			expect(cookieOptionsToken(1).secure).toBe(false)
			expect(cookieOptionsRefresh().secure).toBe(false)
		} finally {
			vi.unstubAllEnvs()
		}
	})
})
