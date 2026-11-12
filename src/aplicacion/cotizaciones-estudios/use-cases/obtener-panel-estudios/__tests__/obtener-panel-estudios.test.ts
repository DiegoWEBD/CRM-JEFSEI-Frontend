import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({
	cookies: vi.fn(async () => ({ toString: (): string => 'token=abc' })),
}))
vi.mock('@/infraestructura/axios/axios-client', () => ({
	axiosClient: { get: vi.fn() },
}))

import { obtenerPanelEstudios } from '@/aplicacion/cotizaciones-estudios/use-cases/obtener-panel-estudios/obtener-panel-estudios'
import { axiosClient } from '@/infraestructura/axios/axios-client'

const axiosGetMock = vi.mocked(axiosClient.get)

const RESPUESTA = {
	data: [
		{
			id: 1,
			id_prospecto: 101,
			id_proceso_comercial: 202,
			cliente: 'Condominio Las Torres',
			linea_seguro: 'Incendio Condominio',
			ejecutivo_comercial: 'Ana Pérez',
			prioridad: 'alta',
			cantidad_cotizaciones: 1,
			fecha: '2026-11-10T10:00:00',
			vencimiento_mas_proximo: '2026-12-01T00:00:00',
			estado: 'VIGENTE',
			tiene_estudio: false,
			id_estudio: null,
			cotizaciones: [
				{
					id: 11,
					company: 'Company',
					prima_neta: 10,
					prima_bruta: 11.9,
					fecha_vencimiento: '2026-12-01T00:00:00',
					estado: 'VIGENTE',
				},
			],
		},
	],
	contadores: {
		cotizaciones_vigentes: 1,
		cotizaciones_por_vencer: 2,
		cotizaciones_vencidas: 3,
		estudios_pendientes: 4,
		estudios_emitidos: 5,
	},
	total: 23,
	pagina: 1,
	tamano_pagina: 10,
	total_paginas: 3,
}

beforeEach(() => {
	axiosGetMock.mockResolvedValue({ data: RESPUESTA })
})

describe('obtenerPanelEstudios — listado paginado con resumen de cotizaciones', () => {
	it('devuelve la respuesta del backend tal cual', async () => {
		const respuesta = await obtenerPanelEstudios()

		expect(respuesta).toBe(RESPUESTA)
		expect(respuesta.data[0].cotizaciones[0].company).toBe('Company')
		expect(respuesta.contadores.cotizaciones_vigentes).toBe(1)
	})

	it('pide la página al backend con todos los query params', async () => {
		await obtenerPanelEstudios({
			textoBusqueda: 'torres',
			estado: 'cotizaciones_vigentes',
			prioridad: 'alta',
			rutEjecutivo: '11111111-1',
			pagina: 2,
			tamanoPagina: 10,
		})

		expect(axiosGetMock).toHaveBeenCalledTimes(1)
		const url = String(axiosGetMock.mock.calls[0][0])
		expect(url).toContain('/solicitudes-cotizacion/panel-estudios?')
		expect(url).toContain('texto_busqueda=torres')
		expect(url).toContain('estado=cotizaciones_vigentes')
		expect(url).toContain('prioridad=alta')
		expect(url).toContain('rut_ejecutivo=11111111-1')
		expect(url).toContain('pagina=2')
		expect(url).toContain('tamano_pagina=10')
	})

	it('sin filtros usa página 1 y tamaño 10 por defecto', async () => {
		await obtenerPanelEstudios()

		const url = String(axiosGetMock.mock.calls[0][0])
		expect(url).not.toContain('texto_busqueda')
		expect(url).not.toContain('estado=')
		expect(url).not.toContain('prioridad')
		expect(url).not.toContain('rut_ejecutivo')
		expect(url).toContain('pagina=1')
		expect(url).toContain('tamano_pagina=10')
	})

	it('reenvía la cookie de sesión al backend', async () => {
		await obtenerPanelEstudios()

		const config = axiosGetMock.mock.calls[0][1] as {
			headers: { Cookie: string }
		}
		expect(config.headers.Cookie).toBe('token=abc')
	})
})
