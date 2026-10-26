// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', async () => {
	const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
	return mockNextHeadersImpl
})

import { getSession, hasRole, hasSomeRole } from '@/lib/auth'
import { payloadSesion, tokenSesion, TOKEN_MALFORMADO } from '@/test/fixtures/sesion'
import { fijarCookies, limpiarNextHeaders } from '@/test/helpers/next-headers'

beforeEach(() => {
	limpiarNextHeaders()
})

describe('getSession — lectura de la sesión desde la cookie', () => {
	it('devuelve null si no hay access token', async () => {
		expect(await getSession()).toBeNull()
	})

	it('devuelve null si el token venció', async () => {
		fijarCookies({ token: tokenSesion({ enSegundos: -1 }) })

		expect(await getSession()).toBeNull()
	})

	it('devuelve null si el token no es un JWT legible', async () => {
		fijarCookies({ token: TOKEN_MALFORMADO })

		expect(await getSession()).toBeNull()
	})

	it('devuelve los claims del token vigente', async () => {
		fijarCookies({
			token: tokenSesion({
				rut: '11.111.111-1',
				codigo_roles: ['GERENTE_COMERCIAL'],
				codigo_permisos: ['VER_PLAN_PAGO_GLOBAL'],
			}),
		})

		const sesion = await getSession()

		expect(sesion?.rut).toBe('11.111.111-1')
		expect(sesion?.codigo_roles).toEqual(['GERENTE_COMERCIAL'])
		expect(sesion?.codigo_permisos).toEqual(['VER_PLAN_PAGO_GLOBAL'])
	})
})

describe('hasRole / hasSomeRole — consultas de rol sobre la sesión', () => {
	it('sin sesión ningún rol es verdadero', async () => {
		expect(await hasRole('GERENTE_GENERAL')).toBe(false)
		expect(await hasSomeRole(['GERENTE_GENERAL', 'GERENTE_COMERCIAL'])).toBe(false)
	})

	it('comprueba el rol exacto presente en el JWT', async () => {
		fijarCookies({
			token: tokenSesion({
				codigo_roles: ['EJECUTIVO_COMERCIAL', 'EJECUTIVO_RENOVACION'],
			}),
		})

		expect(await hasRole('EJECUTIVO_COMERCIAL')).toBe(true)
		expect(await hasRole('GERENTE_GENERAL')).toBe(false)
	})

	it('hasSomeRole es un OR sobre la lista indicada', async () => {
		fijarCookies({ token: tokenSesion({ codigo_roles: ['EJECUTIVO_COBRANZA'] }) })

		expect(await hasSomeRole(['GERENTE_GENERAL', 'EJECUTIVO_COBRANZA'])).toBe(true)
		expect(await hasSomeRole(['GERENTE_GENERAL', 'GERENTE_COMERCIAL'])).toBe(false)
	})

	it('un token vencido no confiere ningún rol', async () => {
		fijarCookies({
			token: tokenSesion({ enSegundos: -5, codigo_roles: ['GERENTE_GENERAL'] }),
		})

		expect(await hasRole('GERENTE_GENERAL')).toBe(false)
	})
})

describe('getSession — el token crudo no se reenvía hacia la UI', () => {
	it('la sesión contiene los claims, no la cadena del JWT', async () => {
		const jwt = tokenSesion()
		fijarCookies({ token: jwt })

		const sesion = await getSession()

		expect(JSON.stringify(sesion)).not.toContain(jwt)
		expect(JSON.stringify(sesion)).not.toContain('firma-sintetica')
		expect(payloadSesion().codigo_permisos).toBeDefined()
	})
})
