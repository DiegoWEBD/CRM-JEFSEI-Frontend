import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'

import { normalizarErrorServidor } from '../normalizar-error-servidor'

function errorDeBackend(status: number, data: unknown): AxiosError {
	const config = { url: '/api/prospectos' } as AxiosRequestConfig as AxiosResponse['config']
	const response: AxiosResponse = {
		data,
		status,
		statusText: '',
		headers: {},
		config,
		request: null,
	}
	return new AxiosError('Request failed', String(status), config, null, response)
}

async function cuerpo(res: Response): Promise<Record<string, unknown>> {
	return (await res.json()) as Record<string, unknown>
}

describe('normalizarErrorServidor — cómo se traducen los errores del backend', () => {
	it('mantiene el status HTTP del backend', () => {
		for (const status of [400, 401, 403, 404, 409, 422, 500, 503]) {
			expect(normalizarErrorServidor(errorDeBackend(status, {}), 'x').status).toBe(status)
		}
	})

	it('usa el mensaje del backend con la precedencia message > error > detail', async () => {
		const conMessage = normalizarErrorServidor(
			errorDeBackend(422, { message: 'desde message', error: 'desde error', detail: 'desde detail' }),
			'x',
		)
		const conError = normalizarErrorServidor(
			errorDeBackend(422, { error: 'desde error', detail: 'desde detail' }),
			'x',
		)
		const conDetail = normalizarErrorServidor(errorDeBackend(422, { detail: 'desde detail' }), 'x')

		expect((await cuerpo(conMessage)).error).toBe('desde message')
		expect((await cuerpo(conError)).error).toBe('desde error')
		expect((await cuerpo(conDetail)).error).toBe('desde detail')
	})

	it('cae al mensaje de axios cuando el backend no devuelve mensaje conocido', async () => {
		const res = normalizarErrorServidor(errorDeBackend(502, {}), 'x')

		expect(res.status).toBe(502)
		expect((await cuerpo(res)).error).toBe('Request failed')
	})

	it('sin respuesta del backend usa 500 con el mensaje fijo del handler', async () => {
		const error = new AxiosError('Network Error', 'ERR_NETWORK')
		const res = normalizarErrorServidor(error, 'Error obteniendo prospectos')

		expect(res.status).toBe(500)
		expect((await cuerpo(res)).error).toBe('Network Error')
	})

	it('ante una excepción no-axios responde 500 con el mensaje fijo, sin detalles internos', async () => {
		const error = new Error('ECONNREFUSED 10.0.0.5:8000')
		error.stack = 'Error: ECONNREFUSED\n    at /srv/app/route.ts:12:5'
		const res = normalizarErrorServidor(error, 'Error obteniendo prospectos')

		expect(res.status).toBe(500)
		const body = await cuerpo(res)
		expect(body.error).toBe('Error obteniendo prospectos')
		expect(JSON.stringify(body)).not.toContain('ECONNREFUSED')
		expect(JSON.stringify(body)).not.toContain('route.ts')
		expect(body).not.toHaveProperty('stack')
	})

	it('nunca emite una traza de error en el cuerpo', async () => {
		const respuestas = [
			normalizarErrorServidor(errorDeBackend(500, { detail: 'falló algo' }), 'x'),
			normalizarErrorServidor(new Error('falló algo'), 'x'),
		]

		for (const res of respuestas) {
			const body = await cuerpo(res)
			expect(body).not.toHaveProperty('stack')
			expect(Object.keys(body)).toEqual(['error'])
		}
	})
})
