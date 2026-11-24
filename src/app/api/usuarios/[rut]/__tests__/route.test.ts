// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', async () => {
	const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
	return mockNextHeadersImpl
})

import { axiosClient } from '@/infraestructura/axios/axios-client'
import { fijarCookies, limpiarNextHeaders } from '@/test/helpers/next-headers'
import { simularRed, type RedSimulada } from '@/test/helpers/red-simulada'
import { PATCH } from '../route'

const RUT = '12345678-9'

function peticionPatch(body: unknown): Request {
	return new Request(`http://crm.test/api/usuarios/${RUT}`, {
		method: 'PATCH',
		body: JSON.stringify(body),
		headers: { 'content-type': 'application/json' },
	})
}

let red: RedSimulada

beforeEach(() => {
	limpiarNextHeaders()
	red = simularRed(() => ({ status: 200, data: { message: 'ok' } }), [axiosClient])
	fijarCookies({ token: 'token-sintetico' })
})

describe('PATCH /api/usuarios/[rut] — actualizar perfil propio', () => {
	it('reenvía el nombre al backend con la cookie de sesión', async () => {
		const res = await PATCH(peticionPatch({ nombre: 'Nombre Nuevo' }), {
			params: Promise.resolve({ rut: RUT }),
		})

		expect(res.status).toBe(200)
		const llamada = red.buscar(l => l.method === 'patch')
		expect(llamada?.url).toBe(`/usuarios/${RUT}`)
		expect(llamada?.data).toBe(JSON.stringify({ nombre: 'Nombre Nuevo' }))
		expect(String(llamada?.headers.Cookie ?? '')).toContain('token-sintetico')
	})

	it('propaga el error del backend con su status', async () => {
		red.restaurar()
		red = simularRed(
			() => ({ status: 403, data: { detail: 'Solo puede actualizar su propio perfil' } }),
			[axiosClient],
		)

		const res = await PATCH(peticionPatch({ nombre: 'Nombre Nuevo' }), {
			params: Promise.resolve({ rut: RUT }),
		})

		expect(res.status).toBe(403)
		const body = await res.json()
		expect(body.error).toBe('Solo puede actualizar su propio perfil')
	})
})
