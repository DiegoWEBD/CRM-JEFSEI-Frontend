// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', async () => {
	const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
	return mockNextHeadersImpl
})

import { axiosClient } from '@/infraestructura/axios/axios-client'
import { fijarCookies, limpiarNextHeaders } from '@/test/helpers/next-headers'
import { simularRed, type RedSimulada } from '@/test/helpers/red-simulada'
import { GET as productosDeLinea } from '@/app/api/lineas-negocio/[id]/productos/route'
import { GET as proximoContacto } from '@/app/api/usuarios/[rut]/recordatorios/proximo-contacto/route'
import { GET as ultimaGestion } from '@/app/api/gestiones-comerciales/final/route'
import { GET as gestiones } from '@/app/api/gestiones-comerciales/route'

let red: RedSimulada

beforeEach(() => {
	limpiarNextHeaders()
	fijarCookies({ token: 'token-sintetico' })
	red = simularRed(() => ({ status: 200, data: { productos: [] } }), [axiosClient])
})

describe('GET /api/lineas-negocio/[id]/productos — parámetro de ruta', () => {
	it('rechaza con 400 un id que no sea numérico', async () => {
		const res = await productosDeLinea(new Request('http://crm.test/api/lineas-negocio/abc/productos'), {
			params: Promise.resolve({ id: 'abc' }),
		})

		expect(res.status).toBe(400)
		expect((await res.json()).error).toBe('ID de línea de negocio inválido')
		expect(red.llamadas).toHaveLength(0)
	})

	it('rechaza con 400 un id vacío', async () => {
		const res = await productosDeLinea(new Request('http://crm.test/api/lineas-negocio//productos'), {
			params: Promise.resolve({ id: '' }),
		})

		expect(res.status).toBe(400)
		expect(red.llamadas).toHaveLength(0)
	})

	it('reenvía el id numérico convertido a número', async () => {
		const res = await productosDeLinea(new Request('http://crm.test/api/lineas-negocio/10/productos'), {
			params: Promise.resolve({ id: '10' }),
		})

		expect(res.status).toBe(200)
		expect(await res.json()).toEqual([])
		expect(red.llamadas).toHaveLength(1)
		expect(red.llamadas[0]!.url).toContain('/lineas-negocio/10/productos')
	})
})

describe('GET /api/usuarios/[rut]/recordatorios/proximo-contacto — parámetro de query', () => {
	const peticion = (query: string) =>
		new Request(`http://crm.test/api/usuarios/11.111.111-1/recordatorios/proximo-contacto${query}`)

	it('exige id_prospecto y responde 400 si falta', async () => {
		const res = await proximoContacto(peticion(''), {
			params: Promise.resolve({ rut: '11.111.111-1' }),
		})

		expect(res.status).toBe(400)
		expect((await res.json()).error).toBe('id_prospecto es requerido')
		expect(red.llamadas).toHaveLength(0)
	})

	it('no acepta un id_prospecto vacío', async () => {
		const res = await proximoContacto(peticion('?id_prospecto='), {
			params: Promise.resolve({ rut: '11.111.111-1' }),
		})

		expect(res.status).toBe(400)
		expect(red.llamadas).toHaveLength(0)
	})

	it('convierte id_prospecto a número antes de consultarlo', async () => {
		const res = await proximoContacto(peticion('?id_prospecto=42'), {
			params: Promise.resolve({ rut: '11.111.111-1' }),
		})

		expect(res.status).toBe(200)
		const llamada = red.llamadas[0]!
		expect(llamada.url).toContain('/usuarios/11.111.111-1/recordatorios/proximo-contacto')
		// Llega como número: un string no debe colarse como id de prospecto.
		expect(llamada.params).toEqual({ id_prospecto: 42 })
		expect(typeof (llamada.params as { id_prospecto: unknown }).id_prospecto).toBe('number')
	})
})

describe('GET /api/gestiones-comerciales — parámetros de query', () => {
	it('exige id_prospecto en la última gestión', async () => {
		const res = await ultimaGestion(
			new Request('http://crm.test/api/gestiones-comerciales/final'),
		)

		expect(res.status).toBe(400)
		expect((await res.json()).error).toBe('id_prospecto es requerido')
		expect(red.llamadas).toHaveLength(0)
	})

	it('solo reenvía id_prospecto y descarta el resto de la query', async () => {
		const res = await gestiones(
			new Request(
				'http://crm.test/api/gestiones-comerciales?id_prospecto=7&estado=ganado&pagina=999&injected=1',
			),
		)

		expect(res.status).toBe(200)
		const url = red.llamadas[0]!.url
		expect(url).toContain('id_prospecto=7')
		expect(url).not.toContain('estado=ganado')
		expect(url).not.toContain('pagina=999')
		expect(url).not.toContain('injected=1')
	})

	it('omite la query entera cuando no hay id_prospecto', async () => {
		const res = await gestiones(new Request('http://crm.test/api/gestiones-comerciales'))

		expect(res.status).toBe(200)
		expect(red.llamadas[0]!.url).not.toContain('?')
	})
})

describe('BFF — reenvío de la sesión al backend', () => {
	it('reenvía exactamente las cookies del request entrante como cabecera Cookie', async () => {
		limpiarNextHeaders()
		fijarCookies({ token: 'token-del-usuario', refresh_token: 'refresh-del-usuario' })

		await productosDeLinea(new Request('http://crm.test/api/lineas-negocio/1/productos'), {
			params: Promise.resolve({ id: '1' }),
		})

		// El backend autoriza con el JWT del usuario; el BFF no debe sustituirlo
		// por otro valor ni tomarlo del body/query del cliente.
		expect(red.llamadas[0]!.headers.Cookie).toBe(
			'token=token-del-usuario; refresh_token=refresh-del-usuario',
		)
	})
})
