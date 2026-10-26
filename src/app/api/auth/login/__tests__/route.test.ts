// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', async () => {
	const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
	return mockNextHeadersImpl
})

import { axiosClient } from '@/infraestructura/axios/axios-client'
import { codificarJwt, payloadSesion, TOKEN_MALFORMADO } from '@/test/fixtures/sesion'
import { simularRed, type Responder } from '@/test/helpers/red-simulada'
import { POST } from '../route'

const URL_LOGIN = 'http://crm.test/api/auth/login'

function peticionLogin(rut = '11111111', password = 'clave-sintetica') {
	return new Request(URL_LOGIN, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ rut, password }),
	})
}

function respuestaBackendValida(enSegundos = 3600) {
	return {
		access_token: codificarJwt(payloadSesion({ enSegundos })),
		refresh_token: 'refresh-token-sintetico',
		token_type: 'bearer',
		expire_minutes: 60,
		usuario: { rut: '11111111', nombre: 'Usuario de Prueba' },
	}
}

/** Cabeceras Set-Cookie emitidas, como las ve el navegador. */
function setCookies(res: Response): string[] {
	return res.headers.getSetCookie()
}

/**
 * Cabecera Set-Cookie de `nombre`, con el valor decodificado (Next serializa los
 * valores de cookie con encodeURIComponent).
 */
function cookieCon(nombre: string, res: Response): string | undefined {
	const cruda = setCookies(res).find(c => c.startsWith(`${nombre}=`))
	return cruda === undefined ? undefined : decodeURIComponent(cruda)
}

let red: ReturnType<typeof simularRed>

function responderCon(datos: unknown, status = 200): Responder {
	return () => ({ status, data: datos })
}

beforeEach(() => {
	red = simularRed(responderCon(respuestaBackendValida()), [axiosClient])
})

describe('POST /api/auth/login — emisión de la sesión', () => {
	it('setea la cookie de access token como HttpOnly y con duración derivada del exp del JWT', async () => {
		red.restaurar()
		red = simularRed(responderCon(respuestaBackendValida(120)), [axiosClient])

		const res = await POST(peticionLogin())
		expect(res.status).toBe(200)

		const cookie = cookieCon('token', res)
		expect(cookie).toBeDefined()
		expect(cookie).toContain(`token=${codificarJwt(payloadSesion({ enSegundos: 120 }))}`)
		// HttpOnly: el JS del navegador no puede leer el token.
		expect(cookie).toMatch(/HttpOnly/i)
		expect(cookie).toMatch(/SameSite=Lax/i)
		expect(cookie).toMatch(/Path=\//i)
		// 120 segundos de vida del JWT → Max-Age acotado, no la sesión permanente.
		const maxAge = Number(/Max-Age=(\d+)/i.exec(cookie!)?.[1])
		expect(maxAge).toBeGreaterThan(0)
		expect(maxAge).toBeLessThanOrEqual(120)
	})

	it('emite el refresh_token solo como cookie HttpOnly de larga duración', async () => {
		const res = await POST(peticionLogin())

		const cookie = cookieCon('refresh_token', res)
		expect(cookie).toBeDefined()
		expect(cookie).toContain('refresh-token-sintetico')
		expect(cookie).toMatch(/HttpOnly/i)
		expect(cookie).toMatch(/Max-Age=2592000/i) // 30 días
	})

	it('nunca devuelve el refresh_token en el body de la respuesta', async () => {
		const res = await POST(peticionLogin())
		const body = (await res.json()) as Record<string, unknown>

		expect(body).not.toHaveProperty('refresh_token')
		expect(JSON.stringify(body)).not.toContain('refresh-token-sintetico')
	})

	it('no emite cookie de refresh cuando el backend no la devuelve', async () => {
		red.restaurar()
		const sinRefresh = respuestaBackendValida()
		delete (sinRefresh as { refresh_token?: string }).refresh_token
		red = simularRed(responderCon(sinRefresh), [axiosClient])

		const res = await POST(peticionLogin())

		expect(res.status).toBe(200)
		expect(cookieCon('token', res)).toBeDefined()
		expect(cookieCon('refresh_token', res)).toBeUndefined()
	})
})

describe('POST /api/auth/login — rechazo de credenciales', () => {
	it('propaga el 401 del backend y no emite cookies de sesión', async () => {
		red.restaurar()
		red = simularRed(
			() => ({ status: 401, data: { detail: 'Usuario o contraseña incorrectos' } }),
			[axiosClient],
		)

		const res = await POST(peticionLogin())

		expect(res.status).toBe(401)
		expect(setCookies(res)).toHaveLength(0)
		const body = (await res.json()) as Record<string, unknown>
		expect(body.error).toBe('Usuario o contraseña incorrectos')
	})

	it('propaga el 403 como falta de permiso y no como sesión iniciada', async () => {
		red.restaurar()
		red = simularRed(
			() => ({ status: 403, data: { detail: 'Usuario bloqueado' } }),
			[axiosClient],
		)

		const res = await POST(peticionLogin())

		expect(res.status).toBe(403)
		expect(setCookies(res)).toHaveLength(0)
	})

	it('ante un fallo de red devuelve 500 sin filtrar trazas ni credenciales', async () => {
		red.restaurar()
		red = simularRed(
			() => {
				throw new Error('connect ECONNREFUSED 10.0.0.5:8000')
			},
			[axiosClient],
		)

		const res = await POST(peticionLogin('22222222', 'clave-muy-secreta'))

		expect(res.status).toBe(500)
		const crudo = JSON.stringify(await res.json())
		expect(crudo).not.toContain('clave-muy-secreta')
		expect(crudo).not.toContain('22222222')
		expect(crudo).not.toContain('ECONNREFUSED')
		expect(crudo).not.toContain('at ')
		expect(crudo).not.toHaveProperty('stack')
	})
})

describe('POST /api/auth/login — contrato con el backend', () => {
	it('reenvía las credenciales recibidas sin transformarlas', async () => {
		await POST(peticionLogin('33333333', 'clave-de-prueba'))

		const llamada = red.buscar(l => l.url.includes('/auth/login'))
		expect(llamada).toBeDefined()
		expect(JSON.parse(String(llamada!.data))).toEqual({
			rut: '33333333',
			password: 'clave-de-prueba',
		})
	})

	it('no acepta un JWT ilegible como válido: responde 500 sin cookies', async () => {
		red.restaurar()
		red = simularRed(
			responderCon({ ...respuestaBackendValida(), access_token: TOKEN_MALFORMADO }),
			[axiosClient],
		)

		const res = await POST(peticionLogin())

		// El route handler decodifica el payload para calcular Max-Age; si no es
		// parseable no debe emitir una cookie de sesión "a ciegas".
		expect(res.status).toBe(500)
		expect(setCookies(res)).toHaveLength(0)
	})
})
