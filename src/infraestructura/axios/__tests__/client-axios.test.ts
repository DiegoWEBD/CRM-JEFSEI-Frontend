import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import axios from 'axios'
import { clientAxios } from '../client-axios'
import { codificarJwt, payloadSesion } from '@/test/fixtures/sesion'
import { simularRed, type RedSimulada, type Responder } from '@/test/helpers/red-simulada'
import { simularFetch, type FetchSimulado } from '@/test/helpers/fetch-simulado'

const PAYLOAD_NUEVO = payloadSesion({ rut: '77.777.777-7', enSegundos: 900 })

function acceso(nuevo = false) {
	return {
		access_token: codificarJwt(nuevo ? PAYLOAD_NUEVO : payloadSesion()),
		token_type: 'bearer',
		expire_minutes: 15,
	}
}

let red: RedSimulada
let fetchSimulado: FetchSimulado
let reemplazarUbicacion: ReturnType<typeof vi.fn>
let restaurarUbicacion: () => void

function instalarUbicacionFalsa() {
	reemplazarUbicacion = vi.fn()
	const original = window.location
	Object.defineProperty(window, 'location', {
		configurable: true,
		writable: true,
		value: {
			...original,
			replace: reemplazarUbicacion,
			href: 'http://crm.test/prospectos',
		},
	})
	return () =>
		Object.defineProperty(window, 'location', {
			configurable: true,
			writable: true,
			value: original,
		})
}

beforeEach(() => {
	restaurarUbicacion = instalarUbicacionFalsa()
	fetchSimulado = simularFetch(() => ({ status: 200, json: acceso() }))
})

afterEach(() => {
	restaurarUbicacion()
})

/** Contadores de los eventos de sesión que emite el interceptor. */
function escucharEventos() {
	const expirado = vi.fn()
	const refrescado = vi.fn()
	window.addEventListener('session-expired', expirado)
	window.addEventListener('session-refreshed', refrescado as EventListener)
	return {
		expirado,
		refrescado,
		detener() {
			window.removeEventListener('session-expired', expirado)
			window.removeEventListener('session-refreshed', refrescado as EventListener)
		},
	}
}

/** Responde 401 las primeras `fallos` veces y 200 después. */
function responderConFallos(fallos: number, datos: unknown = {}): Responder {
	let llamada = 0
	return () => {
		llamada += 1
		return llamada <= fallos
			? { status: 401, data: { error: 'token expirado' } }
			: { status: 200, data: datos }
	}
}

describe('client-axios — respuesta 401', () => {
	it('refresca el token y reintenta la petición original hasta completarla', async () => {
		red = simularRed(responderConFallos(1, { data: [{ id: 1 }] }), [axios, clientAxios])

		const res = await clientAxios.get('/api/prospectos')

		expect(res.status).toBe(200)
		expect(res.data.data).toEqual([{ id: 1 }])
		expect(fetchSimulado.llamadas).toHaveLength(1)
		expect(red.llamadas).toHaveLength(2)
	})

	it('reintenta una sola vez: un segundo 401 no abre un bucle de peticiones', async () => {
		red = simularRed(() => ({ status: 401, data: {} }), [axios, clientAxios])
		const eventos = escucharEventos()

		await expect(clientAxios.get('/api/prospectos')).rejects.toMatchObject({
			response: { status: 401 },
		})

		// original + un único reintento
		expect(red.llamadas).toHaveLength(2)
		expect(fetchSimulado.llamadas).toHaveLength(1)
		eventos.detener()
	})

	it('si el reintento también falla cierra la sesión y redirige al logout', async () => {
		red = simularRed(() => ({ status: 401, data: {} }), [axios, clientAxios])
		const eventos = escucharEventos()

		await expect(clientAxios.get('/api/prospectos')).rejects.toMatchObject({
			response: { status: 401 },
		})

		expect(eventos.expirado).toHaveBeenCalledTimes(1)
		expect(reemplazarUbicacion).toHaveBeenCalledTimes(1)
		expect(reemplazarUbicacion).toHaveBeenCalledWith('/api/auth/logout?redirect=/login')
		eventos.detener()
	})

	it('si el refresh falla limpia la sesión en el navegador y redirige al logout', async () => {
		red = simularRed(() => ({ status: 401, data: {} }), [axios, clientAxios])
		fetchSimulado.restaurar()
		fetchSimulado = simularFetch(() => ({ status: 401, json: {} }))
		const eventos = escucharEventos()

		await expect(clientAxios.get('/api/polizas')).rejects.toMatchObject({
			response: { status: 401 },
		})

		// Sin refresh válido no hay reintento y se va al logout a limpiar cookies.
		expect(red.llamadas).toHaveLength(1)
		expect(eventos.expirado).toHaveBeenCalledTimes(1)
		expect(reemplazarUbicacion).toHaveBeenCalledTimes(1)
		expect(reemplazarUbicacion).toHaveBeenCalledWith('/api/auth/logout?redirect=/login')
		eventos.detener()
	})

	it('no intenta refrescar contra /api/auth/* para no abrir un bucle de refresco', async () => {
		red = simularRed(() => ({ status: 401, data: { error: 'credenciales inválidas' } }), [
			axios,
			clientAxios,
		])
		const eventos = escucharEventos()

		await expect(clientAxios.post('/api/auth/login', {})).rejects.toMatchObject({
			response: { status: 401 },
		})

		expect(fetchSimulado.llamadas).toHaveLength(0)
		expect(red.llamadas).toHaveLength(1)
		expect(eventos.expirado).not.toHaveBeenCalled()
		expect(reemplazarUbicacion).not.toHaveBeenCalled()
		eventos.detener()
	})

	it('un refresh exitoso emite session-refreshed con el payload nuevo', async () => {
		fetchSimulado.restaurar()
		fetchSimulado = simularFetch(() => ({ status: 200, json: acceso(true) }))
		red = simularRed(responderConFallos(1), [axios, clientAxios])
		const eventos = escucharEventos()

		await clientAxios.get('/api/prospectos')

		expect(eventos.refrescado).toHaveBeenCalledTimes(1)
		const payload = (eventos.refrescado.mock.calls[0]![0] as CustomEvent).detail
		expect(payload.rut).toBe('77.777.777-7')
		expect(payload.codigo_roles).toEqual(['EJECUTIVO_COMERCIAL'])
		eventos.detener()
	})
})

describe('client-axios — respuestas que no son 401', () => {
	it('un 403 se rechaza como falta de permiso: sin refresh, sin redirect y sin éxito', async () => {
		red = simularRed(() => ({ status: 403, data: { detail: 'No puedes ver estas pólizas' } }), [
			axios,
			clientAxios,
		])
		const eventos = escucharEventos()

		const rechazo = await clientAxios.get('/api/polizas').catch(e => e)

		expect(rechazo.response?.status).toBe(403)
		expect(rechazo.response?.data?.detail).toBe('No puedes ver estas pólizas')
		expect(fetchSimulado.llamadas).toHaveLength(0)
		expect(eventos.expirado).not.toHaveBeenCalled()
		expect(reemplazarUbicacion).not.toHaveBeenCalled()
		eventos.detener()
	})

	it('un 500 del backend se rechaza sin darlo por éxito ni tocar la sesión', async () => {
		red = simularRed(() => ({ status: 500, data: { error: 'algo falló' } }), [axios, clientAxios])
		const eventos = escucharEventos()

		await expect(clientAxios.get('/api/prospectos')).rejects.toMatchObject({
			response: { status: 500 },
		})
		expect(fetchSimulado.llamadas).toHaveLength(0)
		expect(eventos.expirado).not.toHaveBeenCalled()
		eventos.detener()
	})

	it('un error de red se rechaza sin intentar refrescar la sesión', async () => {
		red = simularRed(
			() => {
				throw new Error('Network Error')
			},
			[axios, clientAxios],
		)
		const eventos = escucharEventos()

		await expect(clientAxios.get('/api/prospectos')).rejects.toBeInstanceOf(Error)
		expect(fetchSimulado.llamadas).toHaveLength(0)
		expect(reemplazarUbicacion).not.toHaveBeenCalled()
		eventos.detener()
	})

	it('una respuesta correcta no dispara ningún refresh', async () => {
		red = simularRed(() => ({ status: 200, data: { data: [] } }), [axios, clientAxios])

		const res = await clientAxios.get('/api/prospectos')

		expect(res.status).toBe(200)
		expect(fetchSimulado.llamadas).toHaveLength(0)
	})

	it('colapsa los 401 simultáneos en un solo refresh', async () => {
		red = simularRed(responderConFallos(3), [axios, clientAxios])

		const resultados = await Promise.allSettled([
			clientAxios.get('/api/prospectos'),
			clientAxios.get('/api/polizas'),
			clientAxios.get('/api/notificaciones'),
		])

		// Las tres peticiones terminan correctamente tras el reintento.
		expect(resultados.every(r => r.status === 'fulfilled')).toBe(true)
		// Un refresh compartido, no uno por petición.
		expect(fetchSimulado.llamadas).toHaveLength(1)
	})
})
