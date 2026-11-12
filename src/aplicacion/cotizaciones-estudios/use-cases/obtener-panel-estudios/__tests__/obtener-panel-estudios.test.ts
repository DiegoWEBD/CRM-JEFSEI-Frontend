import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({
	cookies: vi.fn(async () => ({ toString: (): string => 'token=abc' })),
}))
vi.mock('@/infraestructura/axios/axios-client', () => ({
	axiosClient: { get: vi.fn() },
}))
vi.mock(
	'@/aplicacion/estudio-comercial/use-cases/listar-estudios-comerciales/listar-estudios-comerciales',
	() => ({ listarEstudiosComerciales: vi.fn() }),
)

import { listarEstudiosComerciales } from '@/aplicacion/estudio-comercial/use-cases/listar-estudios-comerciales/listar-estudios-comerciales'
import { obtenerPanelEstudios } from '@/aplicacion/cotizaciones-estudios/use-cases/obtener-panel-estudios/obtener-panel-estudios'
import { axiosClient } from '@/infraestructura/axios/axios-client'

const axiosGetMock = vi.mocked(axiosClient.get)
const listarEstudiosMock = vi.mocked(listarEstudiosComerciales)

const SOLICITUD_CON_TODO = {
	id: 1,
	id_prospecto: 101,
	nombre_riesgo: 'Condominio Las Torres',
	informacion_completa: true,
	ejecutivo_comercial: 'Ana Pérez',
	tipo: 'incendio',
	producto: 'Incendio Condominio',
	prioridad: 'alta',
	fecha: '2026-11-10T10:00:00',
	tiene_cotizaciones: true,
	campos_faltantes: [],
	recotizacion: false,
	motivo_recotizacion: null,
	estudio_disponible: true,
}

const SOLICITUD_SIN_COTIZACIONES = {
	...SOLICITUD_CON_TODO,
	id: 2,
	id_prospecto: 102,
	nombre_riesgo: 'Edificio Alameda',
	tiene_cotizaciones: false,
	estudio_disponible: false,
}

const COTIZACIONES = [
	{ id: 11, fecha_vencimiento: '2026-12-01', estado: 'vigente' },
	{ id: 12, fecha_vencimiento: '2026-11-20', estado: 'por_vencer' },
]

function configurarRespuestas() {
	axiosGetMock.mockImplementation(async (url: string) => {
		if (url.startsWith('/solicitudes-cotizacion?')) {
			return {
				data: {
					data: [SOLICITUD_CON_TODO, SOLICITUD_SIN_COTIZACIONES],
					contadores: {
						informacion_incompleta: 0,
						listas_para_cotizar: 1,
						cotizaciones_emitidas: 1,
						estudios_emitidos: 1,
					},
					total: 2,
					pagina: 1,
					tamano_pagina: 100,
					total_paginas: 1,
				},
			}
		}
		if (url === '/solicitudes-cotizacion/1/cotizaciones') {
			return { data: { cotizaciones: COTIZACIONES } }
		}
		throw new Error(`URL inesperada: ${url}`)
	})

	listarEstudiosMock.mockImplementation(async (idSolicitud: number) =>
		idSolicitud === 1 ? [{ id: 55, id_solicitud: 1, nombre_archivo: 'e.pdf' }] : [],
	)
}

beforeEach(() => {
	configurarRespuestas()
})

describe('obtenerPanelEstudios — adaptación al listado paginado', () => {
	it('lee la data del nuevo shape y arma las filas', async () => {
		const filas = await obtenerPanelEstudios()

		expect(filas).toHaveLength(2)

		expect(filas[0]).toMatchObject({
			id: 1,
			id_prospecto: 101,
			cliente: 'Condominio Las Torres',
			linea_seguro: 'Incendio Condominio',
			ejecutivo_comercial: 'Ana Pérez',
			cantidad_cotizaciones: 2,
			tiene_estudio: true,
			id_estudio: 55,
			estado: 'por_vencer',
			vencimiento_mas_proximo: '2026-11-20',
		})

		expect(filas[1]).toMatchObject({
			id: 2,
			cliente: 'Edificio Alameda',
			cantidad_cotizaciones: 0,
			tiene_estudio: false,
			id_estudio: null,
		})
	})

	it('pide el listado con el mayor tamaño de página disponible', async () => {
		await obtenerPanelEstudios()

		expect(axiosGetMock.mock.calls[0][0]).toContain('tamano_pagina=100')
	})

	it('no consulta cotizaciones de solicitudes sin cotizaciones', async () => {
		await obtenerPanelEstudios()

		const urls = axiosGetMock.mock.calls.map(call => String(call[0]))
		expect(urls.filter(u => u.endsWith('/cotizaciones'))).toEqual([
			'/solicitudes-cotizacion/1/cotizaciones',
		])
	})
})
