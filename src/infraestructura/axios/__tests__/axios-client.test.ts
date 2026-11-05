import { describe, expect, it, vi } from 'vitest'

import axios from 'axios'
import { axiosClient } from '../axios-client'
import { DIGEST_SIN_PERMISOS, esErrorSinPermisos } from '@/lib/errores'
import { limpiarNextHeaders } from '@/test/helpers/next-headers'
import { simularRed } from '@/test/helpers/red-simulada'

vi.mock('next/headers', async () => {
	const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
	return mockNextHeadersImpl
})

limpiarNextHeaders()

describe('axios-client — respuesta 403 del backend en render de servidor', () => {
	it('se estampa el digest de "sin permisos" sin perder la respuesta del backend', async () => {
		simularRed(() => ({ status: 403, data: { detail: 'No asignado a este prospecto' } }), [
			axiosClient,
		])

		const rechazo = await axiosClient.get('/prospectos/7').catch(e => e)

		expect(esErrorSinPermisos(rechazo)).toBe(true)
		expect(rechazo.digest).toBe(DIGEST_SIN_PERMISOS)
		// El BFF sigue reenviando status y mensaje con `normalizarErrorServidor`.
		expect(axios.isAxiosError(rechazo)).toBe(true)
		expect(rechazo.response?.status).toBe(403)
		expect(rechazo.response?.data?.detail).toBe('No asignado a este prospecto')
	})

	it('un error que no es 403 no se marca como falta de permisos', async () => {
		simularRed(() => ({ status: 500, data: { detail: 'falló algo' } }), [axiosClient])

		const rechazo = await axiosClient.get('/prospectos/7').catch(e => e)

		expect(esErrorSinPermisos(rechazo)).toBe(false)
		expect(rechazo.digest).toBeUndefined()
		expect(rechazo.response?.status).toBe(500)
	})
})
