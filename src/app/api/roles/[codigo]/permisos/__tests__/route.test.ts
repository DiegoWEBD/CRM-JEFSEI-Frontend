// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', async () => {
	const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
	return mockNextHeadersImpl
})

import { axiosClient } from '@/infraestructura/axios/axios-client'
import { fijarCookies, limpiarNextHeaders } from '@/test/helpers/next-headers'
import { leerData, simularRed, type RedSimulada } from '@/test/helpers/red-simulada'
import { PUT } from '../route'

function crearRequest(body: unknown): Request {
	return new Request('http://crm.test/api/roles/GERENTE_GENERAL/permisos', {
		method: 'PUT',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	})
}

const PROPS = { params: Promise.resolve({ codigo: 'GERENTE_GENERAL' }) }

let red: RedSimulada

beforeEach(() => {
	limpiarNextHeaders()
	red = simularRed(() => ({ status: 200, data: { message: 'ok' } }), [axiosClient])
	fijarCookies({ token: 'token-sintetico' })
})

describe('PUT /api/roles/[codigo]/permisos — BFF', () => {
	it('reenvía el body al backend con el código de rol de la ruta', async () => {
		const res = await PUT(
			crearRequest({ codigos_permiso: ['VER_ALERTAS', 'OBTENER_ROLES'] }),
			PROPS,
		)

		expect(res.status).toBe(200)

		const llamada = red.buscar(l => l.url.includes('/roles/GERENTE_GENERAL/permisos'))
		expect(llamada).toBeDefined()
		expect(llamada?.method.toLowerCase()).toBe('put')
		expect(leerData(llamada!)).toEqual({
			codigos_permiso: ['VER_ALERTAS', 'OBTENER_ROLES'],
		})
	})

	it('propaga el status y el mensaje de error del backend', async () => {
		red.restaurar()
		red = simularRed(
			() => ({ status: 404, data: { message: 'El rol no existe' } }),
			[axiosClient],
		)

		const res = await PUT(crearRequest({ codigos_permiso: [] }), PROPS)

		expect(res.status).toBe(404)
		const cuerpo = await res.json()
		expect(cuerpo.error).toBe('El rol no existe')
	})
})
