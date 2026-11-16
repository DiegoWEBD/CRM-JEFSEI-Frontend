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
	return new Request('http://crm.test/api/usuarios/11111111-1/roles', {
		method: 'PUT',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	})
}

const PROPS = { params: Promise.resolve({ rut: '11111111-1' }) }

let red: RedSimulada

beforeEach(() => {
	limpiarNextHeaders()
	red = simularRed(() => ({ status: 200, data: { message: 'ok' } }), [axiosClient])
	fijarCookies({ token: 'token-sintetico' })
})

describe('PUT /api/usuarios/[rut]/roles — BFF', () => {
	it('reenvía los roles al backend con el RUT de la ruta', async () => {
		const res = await PUT(
			crearRequest({ codigo_roles: ['GERENTE_GENERAL'] }),
			PROPS,
		)

		expect(res.status).toBe(200)

		const llamada = red.buscar(l => l.url.includes('/usuarios/11111111-1/roles'))
		expect(llamada).toBeDefined()
		expect(leerData(llamada!)).toEqual({ codigo_roles: ['GERENTE_GENERAL'] })
	})

	it('propaga el status y el mensaje de error del backend', async () => {
		red.restaurar()
		red = simularRed(
			() => ({ status: 409, data: { message: 'Debe asignar al menos un rol' } }),
			[axiosClient],
		)

		const res = await PUT(crearRequest({ codigo_roles: [] }), PROPS)

		expect(res.status).toBe(409)
		const cuerpo = await res.json()
		expect(cuerpo.error).toBe('Debe asignar al menos un rol')
	})
})
