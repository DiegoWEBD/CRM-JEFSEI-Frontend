// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', async () => {
	const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
	return mockNextHeadersImpl
})

import { NextRequest } from 'next/server'
import { codificarJwt, payloadSesion } from '@/test/fixtures/sesion'
import { limpiarNextHeaders } from '@/test/helpers/next-headers'
import { simularFetch, type FetchSimulado } from '@/test/helpers/fetch-simulado'
import { POST } from '../route'

const URL_REFRESH = 'http://crm.test/api/auth/refresh'

function peticionConRefresh(valor = 'refresh-token-original') {
	return new NextRequest(URL_REFRESH, {
		method: 'POST',
		headers: { cookie: `refresh_token=${valor}` },
	})
}

function respuestaBackend(nuevos = true) {
	return nuevos
		? {
				access_token: codificarJwt(payloadSesion({ enSegundos: 600 })),
				refresh_token: 'refresh-token-rotado',
				expire_minutes: 10,
			}
		: null
}

function cookieCon(nombre: string, res: Response): string | undefined {
	const cruda = res.headers.getSetCookie().find(c => c.startsWith(`${nombre}=`))
	return cruda === undefined ? undefined : decodeURIComponent(cruda)
}

let fetchSimulado: FetchSimulado

beforeEach(() => {
	limpiarNextHeaders()
})

describe('POST /api/auth/refresh — rotación de tokens', () => {
	it('rechaza con 401 cuando el navegador no envía refresh_token', async () => {
		fetchSimulado = simularFetch(() => ({ status: 200, json: respuestaBackend() }))

		const res = await POST(new NextRequest(URL_REFRESH, { method: 'POST' }))

		expect(res.status).toBe(401)
		expect((await res.json()).error).toBe('No se encontró refresh token')
		expect(fetchSimulado.llamadas).toHaveLength(0)
		expect(res.headers.getSetCookie()).toHaveLength(0)
	})

	it('limpia ambas cookies cuando el backend rechaza el refresh token', async () => {
		fetchSimulado = simularFetch(() => ({ status: 401, json: { detail: 'refresh reusado' } }))

		const res = await POST(peticionConRefresh())

		expect(res.status).toBe(401)
		const cookies = res.headers.getSetCookie()
		expect(cookies).toHaveLength(2)
		for (const c of cookies) {
			expect(c).toMatch(/Max-Age=0/i)
		}
		expect(cookieCon('token', res)).toBeDefined()
		expect(cookieCon('refresh_token', res)).toBeDefined()
	})

	it('limpia ambas cookies también ante un fallo de red con el backend', async () => {
		fetchSimulado = simularFetch(() => {
			throw new Error('fetch failed')
		})

		const res = await POST(peticionConRefresh())

		expect(res.status).toBe(401)
		expect(res.headers.getSetCookie()).toHaveLength(2)
	})

	it('no filtra el refresh token en el body en ninguna respuesta', async () => {
		fetchSimulado = simularFetch(() => ({ status: 200, json: respuestaBackend() }))

		const exito = await POST(peticionConRefresh())
		const cuerpoExito = JSON.stringify(await exito.json())
		expect(cuerpoExito).not.toContain('refresh-token-rotado')
		expect(cuerpoExito).not.toHaveProperty('refresh_token')

		fetchSimulado.restaurar()
		fetchSimulado = simularFetch(() => ({ status: 401, json: {} }))
		const fallo = await POST(peticionConRefresh())
		expect(JSON.stringify(await fallo.json())).not.toContain('refresh-token-original')
	})

	it('en un refresh exitoso emite las cookies rotadas y devuelve el nuevo access token', async () => {
		fetchSimulado = simularFetch(() => ({ status: 200, json: respuestaBackend() }))

		const res = await POST(peticionConRefresh())

		expect(res.status).toBe(200)
		const body = await res.json()
		expect(body.access_token).toBe(codificarJwt(payloadSesion({ enSegundos: 600 })))
		expect(body.token_type).toBe('bearer')
		expect(body.expire_minutes).toBe(10)

		expect(cookieCon('token', res)).toMatch(/HttpOnly/i)
		expect(cookieCon('refresh_token', res)).toContain('refresh-token-rotado')
		expect(cookieCon('refresh_token', res)).toMatch(/HttpOnly/i)
	})

	it('envía el refresh token recibido al backend, no otro valor', async () => {
		fetchSimulado = simularFetch(() => ({ status: 200, json: respuestaBackend() }))

		await POST(peticionConRefresh('refresh-token-esperado'))

		expect(fetchSimulado.llamadas).toHaveLength(1)
		expect(fetchSimulado.llamadas[0]!.url).toContain('/auth/refresh')
		expect(fetchSimulado.llamadas[0]!.body).toEqual({ refresh_token: 'refresh-token-esperado' })
	})
})
