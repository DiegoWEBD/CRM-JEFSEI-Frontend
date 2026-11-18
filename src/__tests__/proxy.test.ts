// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest'

import { NextRequest } from 'next/server'
import { codificarJwt, payloadSesion, TOKEN_MALFORMADO } from '@/test/fixtures/sesion'
import { simularFetch, type FetchSimulado } from '@/test/helpers/fetch-simulado'
import { proxy, config as configDelProxy } from '@/proxy'

const URL_PROTEGIDA = 'http://crm.test/prospectos'
const URL_LOGIN = 'http://crm.test/login'

function peticionConCookies(cookies: Record<string, string>, url = URL_PROTEGIDA) {
	const header = Object.entries(cookies)
		.map(([k, v]) => `${k}=${v}`)
		.join('; ')
	return new NextRequest(url, { headers: { cookie: header } })
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

describe('proxy — rutas protegidas sin sesión', () => {
	it('sin cookies redirige a /login conservando la ruta en ?next=', async () => {
		const res = await proxy(peticionConCookies({}))

		expect(res.headers.get('location')).toBe(
			'http://crm.test/login?next=%2Fprospectos',
		)
		expect(fetchSimulado.llamadas).toHaveLength(0)
	})

	it('conserva también la query original en ?next=', async () => {
		const res = await proxy(
			peticionConCookies({}, `${URL_PROTEGIDA}?estado=nuevo`),
		)

		expect(res.headers.get('location')).toBe(
			'http://crm.test/login?next=%2Fprospectos%3Festado%3Dnuevo',
		)
	})

	it('tras un refresh fallido redirige a /login y limpia las cookies inválidas', async () => {
		fetchSimulado.restaurar()
		fetchSimulado = simularFetch(() => ({ status: 401, json: {} }))

		const res = await proxy(
			peticionConCookies({
				token: codificarJwt(payloadSesion({ enSegundos: -30 })),
				refresh_token: 'refresh-vencido',
			}),
		)

		expect(res.headers.get('location')).toBe(
			'http://crm.test/login?next=%2Fprospectos',
		)
		const cookies = res.headers.getSetCookie()
		expect(cookies).toHaveLength(2)
		for (const c of cookies) expect(c).toMatch(/Max-Age=0/i)
	})

	it('tras un refresh caído también redirige y limpia las cookies', async () => {
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

		expect(res.headers.get('location')).toBe(
			'http://crm.test/login?next=%2Fprospectos',
		)
		expect(res.headers.getSetCookie()).toHaveLength(2)
	})
})

describe('proxy — /login sin sesión', () => {
	it('muestra el formulario: no redirige ni consulta al backend', async () => {
		const res = await proxy(peticionConCookies({}, URL_LOGIN))

		expect(res.headers.get('location')).toBeNull()
		expect(fetchSimulado.llamadas).toHaveLength(0)
		expect(res.headers.getSetCookie()).toHaveLength(0)
	})

	it('con refresh fallido sigue mostrando el formulario y limpia las cookies', async () => {
		fetchSimulado.restaurar()
		fetchSimulado = simularFetch(() => ({ status: 401, json: {} }))

		const res = await proxy(
			peticionConCookies(
				{
					token: codificarJwt(payloadSesion({ enSegundos: -30 })),
					refresh_token: 'refresh-vencido',
				},
				URL_LOGIN,
			),
		)

		expect(res.headers.get('location')).toBeNull()
		const cookies = res.headers.getSetCookie()
		expect(cookies).toHaveLength(2)
		for (const c of cookies) expect(c).toMatch(/Max-Age=0/i)
	})
})

describe('proxy — /login con sesión', () => {
	it('token vigente redirige al home', async () => {
		const res = await proxy(
			peticionConCookies(
				{ token: codificarJwt(payloadSesion({ enSegundos: 3600 })) },
				URL_LOGIN,
			),
		)

		expect(res.headers.get('location')).toBe('http://crm.test/')
		expect(fetchSimulado.llamadas).toHaveLength(0)
	})

	it('con ?next= vuelve a la ruta que se pedía', async () => {
		const res = await proxy(
			peticionConCookies(
				{ token: codificarJwt(payloadSesion({ enSegundos: 3600 })) },
				`${URL_LOGIN}?next=%2Fpolizas`,
			),
		)

		expect(res.headers.get('location')).toBe('http://crm.test/polizas')
	})

	it('descarta un ?next= externo (open redirect) y va al home', async () => {
		const res = await proxy(
			peticionConCookies(
				{ token: codificarJwt(payloadSesion({ enSegundos: 3600 })) },
				`${URL_LOGIN}?next=https%3A%2F%2Fevil.example%2Frobar`,
			),
		)

		expect(res.headers.get('location')).toBe('http://crm.test/')
	})

	it('tras un refresh exitoso redirige al home llevándose los tokens nuevos', async () => {
		const res = await proxy(
			peticionConCookies(
				{
					token: codificarJwt(payloadSesion({ enSegundos: -30 })),
					refresh_token: 'refresh-sintetico',
				},
				URL_LOGIN,
			),
		)

		expect(fetchSimulado.llamadas).toHaveLength(1)
		expect(res.headers.get('location')).toBe('http://crm.test/')
		expect(cookieCon('token', res)).toContain(RESPUESTA_REFRESH.access_token)
		expect(cookieCon('refresh_token', res)).toContain('refresh-token-rotado')
	})
})

describe('proxy — cuándo intenta rotar el access token', () => {
	it('sin cookies no consulta al backend y manda a /login', async () => {
		const res = await proxy(peticionConCookies({}))

		expect(fetchSimulado.llamadas).toHaveLength(0)
		expect(res.headers.get('location')).toContain('/login')
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
		expect(res.headers.get('location')).toBeNull()
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

describe('proxy — rotación exitosa en rutas protegidas', () => {
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

describe('proxy — alcance', () => {
	// Next compila el matcher como regex anclada sobre el pathname. Sin el
	// helper experimental de Next (rompe el runtime de los tests al mezclarse
	// con next/server), se evalúa el mismo patrón directamente.
	function matcherCubre(pathname: string): boolean {
		const [fuente] = configDelProxy.matcher as string[]
		return new RegExp(`^(?:${fuente})$`).test(pathname)
	}

	it('no intercepta las llamadas del BFF: las rutas /api quedan fuera', () => {
		expect(matcherCubre('/api/auth/login')).toBe(false)
		expect(matcherCubre('/api/panel-estudios')).toBe(false)
	})

	it('no intercepta los assets estáticos', () => {
		const assets = [
			'/_next/static/chunk.js',
			'/_next/image',
			'/favicon.ico',
			'/logo.svg',
			'/imagen.png',
		]
		for (const url of assets) {
			expect(matcherCubre(url)).toBe(false)
		}
	})

	it('sí intercepta las páginas de la app, con y sin sesión', () => {
		const paginas = ['/', '/login', '/prospectos', '/polizas/123.456']
		for (const url of paginas) {
			expect(matcherCubre(url)).toBe(true)
		}
	})
})
