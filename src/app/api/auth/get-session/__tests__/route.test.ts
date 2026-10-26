// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', async () => {
	const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
	return mockNextHeadersImpl
})

import {
	fijarCookies,
	limpiarNextHeaders,
} from '@/test/helpers/next-headers'
import type { TokenPayload } from '@/dtos/token-payload'
import { codificarJwt, payloadSesion, tokenSesion, TOKEN_MALFORMADO } from '@/test/fixtures/sesion'
import { GET } from '../route'

beforeEach(() => {
	limpiarNextHeaders()
})

describe('GET /api/auth/get-session — qué considera una sesión válida', () => {
	it('responde 401 cuando no hay cookie de access token', async () => {
		const res = await GET()

		expect(res.status).toBe(401)
		expect((await res.json()).error).toBe('Usuario no autenticado')
	})

	it('responde 401 cuando el token ya venció, sin darlo por válido', async () => {
		fijarCookies({ token: tokenSesion({ enSegundos: -60 }) })

		const res = await GET()

		expect(res.status).toBe(401)
	})

	it('responde 401 ante un token ilegible, sin propagar el error interno', async () => {
		fijarCookies({ token: TOKEN_MALFORMADO })

		const res = await GET()

		expect(res.status).toBe(401)
		const body = await res.json()
		expect(Object.keys(body)).toEqual(['error'])
		expect(JSON.stringify(body)).not.toContain('SyntaxError')
		expect(JSON.stringify(body)).not.toHaveProperty('stack')
	})

	it('devuelve el payload de la sesión para un token vigente', async () => {
		fijarCookies({
			token: tokenSesion({
				rut: '55.555.555-5',
				codigo_roles: ['GERENTE_GENERAL'],
				codigo_permisos: ['CANCELAR_POLIZA', 'VER_PLAN_PAGO_GLOBAL'],
			}),
		})

		const res = await GET()

		expect(res.status).toBe(200)
		const body = await res.json()
		expect(body.rut).toBe('55.555.555-5')
		expect(body.codigo_roles).toEqual(['GERENTE_GENERAL'])
		expect(body.codigo_permisos).toEqual(['CANCELAR_POLIZA', 'VER_PLAN_PAGO_GLOBAL'])
	})

	it('no devuelve el token crudo: solo los claims de la sesión', async () => {
		const jwt = tokenSesion()
		fijarCookies({ token: jwt })

		const res = await GET()
		const crudo = JSON.stringify(await res.json())

		expect(crudo).not.toContain(jwt)
		expect(crudo).not.toContain('firma-sintetica')
	})

	it('trata un token sin exp como inválido en lugar de aceptarlo por error', async () => {
		// JSON.stringify omite `exp: undefined`, así que el payload queda sin exp.
		const sinExp = { ...payloadSesion(), exp: undefined } as unknown as TokenPayload
		fijarCookies({ token: codificarJwt(sinExp) })

		const res = await GET()

		// `payload.exp > now` con exp undefined es false → sesión no válida.
		expect(res.status).toBe(401)
	})
})
