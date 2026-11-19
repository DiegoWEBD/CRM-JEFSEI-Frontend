// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', async () => {
	const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
	return mockNextHeadersImpl
})

import { axiosClient } from '@/infraestructura/axios/axios-client'
import { fijarCookies, limpiarNextHeaders } from '@/test/helpers/next-headers'
import { simularRed, type RedSimulada } from '@/test/helpers/red-simulada'
import { PUT } from '../route'

const RUT = '12345678-9'
const PAYLOAD = {
	password_actual: 'PasswordActual1',
	password_nueva: 'PasswordNueva1',
}

function peticionPut(body: unknown): Request {
	return new Request(`http://crm.test/api/usuarios/${RUT}/password`, {
		method: 'PUT',
		body: JSON.stringify(body),
		headers: { 'content-type': 'application/json' },
	})
}

let red: RedSimulada

beforeEach(() => {
	limpiarNextHeaders()
	red = simularRed(
		() => ({ status: 200, data: { message: 'Contraseña actualizada correctamente' } }),
		[axiosClient],
	)
	fijarCookies({ token: 'token-sintetico' })
})

describe('PUT /api/usuarios/[rut]/password — cambiar contraseña propia', () => {
	it('reenvía las contraseñas al backend con la cookie de sesión', async () => {
		const res = await PUT(peticionPut(PAYLOAD), {
			params: Promise.resolve({ rut: RUT }),
		})

		expect(res.status).toBe(200)
		const llamada = red.buscar(l => l.method === 'put')
		expect(llamada?.url).toBe(`/usuarios/${RUT}/password`)
		expect(llamada?.data).toBe(JSON.stringify(PAYLOAD))
		expect(String(llamada?.headers.Cookie ?? '')).toContain('token-sintetico')
	})

	it('propaga el error del backend con su status', async () => {
		red.restaurar()
		red = simularRed(
			() => ({
				status: 400,
				data: { detail: 'La contraseña actual no es correcta' },
			}),
			[axiosClient],
		)

		const res = await PUT(peticionPut(PAYLOAD), {
			params: Promise.resolve({ rut: RUT }),
		})

		expect(res.status).toBe(400)
		const body = await res.json()
		expect(body.error).toBe('La contraseña actual no es correcta')
	})
})
