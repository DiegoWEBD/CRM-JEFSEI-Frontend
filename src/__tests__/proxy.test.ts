// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest'

import { NextRequest } from 'next/server'
import { codificarJwt, payloadSesion, TOKEN_MALFORMADO } from '@/test/fixtures/sesion'
import { simularFetch, type FetchSimulado } from '@/test/helpers/fetch-simulado'
import { proxy } from '@/proxy'

const URL_PAGINA = 'http://crm.test/prospectos'

function peticionConCookies(cookies: Record<string, string>) {
	const header = Object.entries(cookies)
		.map(([k, v]) => `${k}=${v}`)
		.join('; ')
	return new NextRequest(URL_PAGINA, { headers: { cookie: header } })
}

function cookieCon(nombre: string, res: Response): string | undefined {
	const cruda = res.headers.getSetCookie().find(c => c.startsWith(`${nombre}=`))
	return cruda === undefined ? undefined : decodeURIComponent(cruda)
}

/** Cookie que el proxy reescribe para que los Server Components la lean en este mismo request. */
function cookieDelRequestInterno(res: Response): string | undefined {
	return (
		res.headers.get('x-middleware-request-cookie') ??
		undefined
	)
}

let fetchSimulado: FetchSimulado

const RESPUESTA_REFRESH = {
	access_token: codificarJwt(payloadSesion({ enSegundos: 900 })),
	refresh_token: 'refresh-token-rotado',
	expire_minutes: 15,
}

beforeEach(() => {
	fetchSimulado = simularFetch(() => ({ status: 200, json: RESPUESTA_REFRESH }))
})

describe('proxy — cuándo intenta rotar el access token', () => {
	it('no toca nada si el navegador no tiene refresh_token', async () => {
		const res = await proxy(peticionConCookies({}))

		expect(fetchSimulado.llamadas).toHaveLength(0)
		expect(res.headers.getSetCookie()).toHaveLength(0)
		expect(res.headers.get('location')).toBeNull()
	})

	it('no llama al backend cuando el access token sigue vigente', async () => {
		const res = await proxy(
			peticionConCookies({
				token: codificarJwt(payloadSesion({ enSegundos: 3600 })),
				refresh_token: 'refresh-sintetico',
			}),
		)

		expect(fetchSimulado.llamadas).toHaveLength(0)
		expect(res.headers.getSetCookie()).toHaveLength(0)
	})

	it('intenta refresh cuando el access token venció', async () => {
		await proxy(
			peticionConCookies({
				token: codificarJwt(payloadSesion({ enSegundos: -30 })),
				refresh_token: 'refresh-sintetico',
			}),
		)

		expect(fetchSimulado.llamadas).toHaveLength(1)
		expect(fetchSimulado.llamadas[0]!.body).toEqual({ refresh_token: 'refresh-sintetico' })
	})

	it('intenta refresh cuando no hay access token pero sí refresh_token', async () => {
		await proxy(peticionConCookies({ refresh_token: 'refresh-sintetico' }))

		expect(fetchSimulado.llamadas).toHaveLength(1)
	})

	it('trata un JWT ilegible como expirado y también intenta refresh', async () => {
		await proxy(
			peticionConCookies({
				token: TOKEN_MALFORMADO,
				refresh_token: 'refresh-sintetico',
			}),
		)

		expect(fetchSimulado.llamadas).toHaveLength(1)
	})
})

describe('proxy — rotación exitosa', () => {
	it('emite las nuevas cookies al navegador con HttpOnly', async () => {
		const res = await proxy(
			peticionConCookies({
				token: codificarJwt(payloadSesion({ enSegundos: -30 })),
				refresh_token: 'refresh-sintetico',
			}),
		)

		expect(cookieCon('token', res)).toContain(RESPUESTA_REFRESH.access_token)
		expect(cookieCon('token', res)).toMatch(/HttpOnly/i)
		expect(cookieCon('refresh_token', res)).toContain('refresh-token-rotado')
		expect(cookieCon('refresh_token', res)).toMatch(/HttpOnly/i)
	})

	it('reescribe la cookie del request para que los Server Components vean el token nuevo', async () => {
		const res = await proxy(
			peticionConCookies({
				token: codificarJwt(payloadSesion({ enSegundos: -30 })),
				refresh_token: 'refresh-sintetico',
				otra: 'valor-ajeno',
			}),
		)

		const cookieInterna = cookieDelRequestInterno(res)
		expect(cookieInterna).toBeDefined()
		expect(cookieInterna).toContain(RESPUESTA_REFRESH.access_token)
		expect(cookieInterna).toContain('refresh-token-rotado')
		// Las cookies ajenas a la sesión se conservan.
		expect(cookieInterna).toContain('otra=valor-ajeno')
	})

	it('no interrumpe la navegación: la respuesta sigue siendo next(), no un redirect', async () => {
		const res = await proxy(
			peticionConCookies({
				token: codificarJwt(payloadSesion({ enSegundos: -30 })),
				refresh_token: 'refresh-sintetico',
			}),
		)

		expect(res.headers.get('location')).toBeNull()
		expect(res.status).toBeLessThan(400)
	})
})

describe('proxy — rotación fallida', () => {
	it('limpia las cookies inválidas para no dejar una sesión rota', async () => {
		fetchSimulado.restaurar()
		fetchSimulado = simularFetch(() => ({ status: 401, json: {} }))

		const res = await proxy(
			peticionConCookies({
				token: codificarJwt(payloadSesion({ enSegundos: -30 })),
				refresh_token: 'refresh-vencido',
			}),
		)

		const cookies = res.headers.getSetCookie()
		expect(cookies).toHaveLength(2)
		for (const c of cookies) expect(c).toMatch(/Max-Age=0/i)
	})

	it('no redirige: deja que cada página decida si requiere sesión', async () => {
		fetchSimulado.restaurar()
		fetchSimulado = simularFetch(() => ({ status: 401, json: {} }))

		const res = await proxy(
			peticionConCookies({
				token: codificarJwt(payloadSesion({ enSegundos: -30 })),
				refresh_token: 'refresh-vencido',
			}),
		)

		expect(res.headers.get('location')).toBeNull()
	})

	it('limpia las cookies también cuando el backend no responde', async () => {
		fetchSimulado.restaurar()
		fetchSimulado = simularFetch(() => {
			throw new Error('network down')
		})

		const res = await proxy(
			peticionConCookies({
				token: codificarJwt(payloadSesion({ enSegundos: -30 })),
				refresh_token: 'refresh-sintetico',
			}),
		)

		expect(res.headers.getSetCookie()).toHaveLength(2)
	})
})

describe('proxy — alcance', () => {
	it('no intercepta las llamadas del BFF: las rutas /api quedan fuera', async () => {
		// Aunque el proxy no se ejecute para /api, su contrato es "no tocar nada"
		// cuando no hay refresh_token: comprobamos que ni siquiera consulta al backend.
		const res = await proxy(peticionConCookies({}))

		expect(fetchSimulado.llamadas).toHaveLength(0)
		expect(res.headers.getSetCookie()).toHaveLength(0)
	})
})

