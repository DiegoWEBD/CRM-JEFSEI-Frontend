import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))

import { filtrosIniciales } from '../query-key-solicitudes-panel'
import { useObtenerTodasSolicitudesCotizacion } from '../use-obtener-todas-solicitudes-cotizacion'

const axiosGetMock = vi.mocked(axios.get)

const RESPUESTA = {
	data: [],
	contadores: {
		informacion_incompleta: 0,
		listas_para_cotizar: 0,
		cotizaciones_emitidas: 0,
		estudios_emitidos: 0,
	},
	total: 0,
	pagina: 1,
	tamano_pagina: 15,
	total_paginas: 1,
}

function renderHookConQuery(
	filtros: ReturnType<typeof filtrosIniciales>,
	initialData?: typeof RESPUESTA,
) {
	const queryClient = new QueryClient()
	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
	return renderHook(
		() => useObtenerTodasSolicitudesCotizacion(filtros, initialData),
		{ wrapper },
	)
}

beforeEach(() => {
	axiosGetMock.mockResolvedValue({ data: RESPUESTA })
})

describe('useObtenerTodasSolicitudesCotizacion — hidratación', () => {
	it('con initialData y consulta inicial usa los datos sin disparar fetch', async () => {
		const { result } = renderHookConQuery(filtrosIniciales(), RESPUESTA)

		expect(result.current.data).toBe(RESPUESTA)
		// Dale tiempo a un eventual refetch en montaje para descartarlo.
		await new Promise(resolve => setTimeout(resolve, 50))
		expect(axiosGetMock).not.toHaveBeenCalled()
	})

	it('con filtros distintos consulta el BFF con todos los query keys', async () => {
		const { result } = renderHookConQuery({
			...filtrosIniciales(),
			textoBusqueda: 'torres',
			estado: 'estudios_emitidos',
			prioridad: 'alta',
			rutUsuario: '11111111-1',
			pagina: 2,
			tamanoPagina: 10,
		})

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(axiosGetMock).toHaveBeenCalledTimes(1)
		const url = String(axiosGetMock.mock.calls[0][0])
		expect(url).toContain('/api/solicitudes-cotizacion?')
		expect(url).toContain('texto_busqueda=torres')
		expect(url).toContain('estado=estudios_emitidos')
		expect(url).toContain('prioridad=alta')
		expect(url).toContain('rut_usuario=11111111-1')
		expect(url).toContain('pagina=2')
		expect(url).toContain('tamano_pagina=10')
	})

	it('sin filtros omite texto_busqueda/estado/prioridad/rut_usuario', async () => {
		const { result } = renderHookConQuery(filtrosIniciales())

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		const url = String(axiosGetMock.mock.calls[0][0])
		expect(url).not.toContain('texto_busqueda')
		expect(url).not.toContain('estado=')
		expect(url).not.toContain('prioridad')
		expect(url).not.toContain('rut_usuario')
		expect(url).toContain('pagina=1')
		expect(url).toContain('tamano_pagina=15')
	})
})
