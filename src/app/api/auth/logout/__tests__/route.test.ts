// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', async () => {
	const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
	return mockNextHeadersImpl
})

import { NextRequest } from 'next/server'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { fijarCookies, limpiarNextHeaders } from '@/test/helpers/next-headers'
import { simularRed, type RedSimulada } from '@/test/helpers/red-simulada'
import { GET, POST } from '../route'

const BASE = 'http://crm.test/api/auth/logout'

function cookieCon(nombre: string, res: Response): string | undefined {
	const cruda = res.headers.getSetCookie().find(c => c.startsWith(`${nombre}=`))
	return cruda === undefined ? undefined : decodeURIComponent(cruda)
}

let red: RedSimulada

beforeEach(() => {
	limpiarNextHeaders()
	red = simularRed(() => ({ status: 200, data: {} }), [axiosClient])
	fijarCookies({ token: 'token-sintetico', refresh_token: 'refresh-sintetico' })
})

describe('POST /api/auth/logout — cierre de sesión', () => {
	it('borra ambas cookies de autenticación', async () => {
		const res = await POST()

		expect(res.status).toBe(200)
		const cookies = res.headers.getSetCookie()
		expect(cookies).toHaveLength(2)
		for (const c of cookies) expect(c).toMatch(/Max-Age=0/i)
		expect(cookieCon('token', res)).toBeDefined()
		expect(cookieCon('refresh_token', res)).toBeDefined()
	})

	it('cierra la sesión aunque el backend no responda', async () => {
		red.restaurar()
		red = simularRed(
			() => {
				throw new Error('backend caído')
			},
			[axiosClient],
		)

		const res = await POST()

		expect(res.status).toBe(200)
		expect(res.headers.getSetCookie()).toHaveLength(2)
	})

	it('no devuelve credenciales en la respuesta', async () => {
		const res = await POST()
		const crudo = JSON.stringify(await res.json())

		expect(crudo).not.toContain('token-sintetico')
		expect(crudo).not.toContain('refresh-sintetico')
	})
})

describe('GET /api/auth/logout — redirección post-logout', () => {
	it('sin parámetro redirect lleva a /login y limpia las cookies', async () => {
		const res = await GET(new NextRequest(BASE, { method: 'GET' }))

		expect(res.headers.get('location')).toBe('http://crm.test/login')
		expect(res.headers.getSetCookie()).toHaveLength(2)
	})

	it('respeta un redirect interno de la aplicación', async () => {
		const res = await GET(
			new NextRequest(`${BASE}?redirect=/prospectos/15`, { method: 'GET' }),
		)

		expect(res.headers.get('location')).toBe('http://crm.test/prospectos/15')
	})

	it('también limpia las cookies cuando el backend notifica el logout', async () => {
		const res = await GET(new NextRequest(`${BASE}?redirect=/login`, { method: 'GET' }))

		expect(red.llamadas.some(l => l.url.includes('/auth/logout'))).toBe(true)
		expect(res.headers.getSetCookie()).toHaveLength(2)
	})
})

/**
 * Regresión de seguridad (CWE-601, open redirect).
 *
 * `new URL('//evil.com', 'https://crm.test')` resuelve a `https://evil.com/`, de
 * modo que un enlace a `/api/auth/logout?redirect=//evil.com` mandaba al usuario
 * a un dominio externo justo después de cerrar sesión (momento idóneo para
 * suplantar la pantalla de login). Estas pruebas fallaban antes de la corrección.
 */
describe('GET /api/auth/logout — la redirección nunca sale del origen de la aplicación', () => {
	const externos = [
		'//evil.example.com',
		'/\\evil.example.com',
		'https://evil.example.com/login',
		'http://evil.example.com/login',
		'javascript:alert(1)',
		'//evil.example.com/%2e%2e',
	]

	it.each(externos)('rechaza %s y redirige a /login', async redirect => {
		const res = await GET(new NextRequest(`${BASE}?redirect=${redirect}`, { method: 'GET' }))

		const location = res.headers.get('location')
		expect(location).toBe('http://crm.test/login')
		expect(location).not.toContain('evil.example.com')
		expect(location).not.toContain('javascript:')
	})

	it('un redirect externo no escapa del origen aunque venga url-encoded', async () => {
		const res = await GET(
			new NextRequest(`${BASE}?redirect=${encodeURIComponent('//evil.example.com')}`, {
				method: 'GET',
			}),
		)

		expect(res.headers.get('location')).toBe('http://crm.test/login')
	})

	it('acepta rutas internas con query y hash', async () => {
		const res = await GET(
			new NextRequest(`${BASE}?redirect=/oportunidades?estado=ganado`, { method: 'GET' }),
		)

		expect(res.headers.get('location')).toBe('http://crm.test/oportunidades?estado=ganado')
	})
})
