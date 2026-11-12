import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/cotizaciones-estudios/use-panel-estudios', () => ({
	usePanelEstudios: vi.fn(),
}))
vi.mock('@/hooks/usuarios/use-usuarios', () => ({
	useUsuarios: vi.fn(),
}))
vi.mock('@/hooks/use-debounce', () => ({
	useDebounce: (valor: string) => valor,
}))
vi.mock('../dialog-ver-cotizaciones', () => ({ default: () => null }))

import type { ObtenerPanelEstudiosResponse } from '@/aplicacion/cotizaciones-estudios/dto/obtener-panel-estudios-response'
import type { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import { usePanelEstudios } from '@/hooks/cotizaciones-estudios/use-panel-estudios'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import PanelCotizacionesEstudiosClient from '../panel-cotizaciones-estudios-client'

const usePanelEstudiosMock = vi.mocked(usePanelEstudios)
const useUsuariosMock = vi.mocked(useUsuarios)

function fila(
	id: number,
	cliente: string,
	extras: Partial<PanelEstudioFila> = {},
): PanelEstudioFila {
	return {
		id,
		id_prospecto: id + 100,
		id_proceso_comercial: id + 200,
		cliente,
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
				id: id * 10,
				company: 'Company',
				prima_neta: 10,
				prima_bruta: 11.9,
				fecha_vencimiento: '2026-12-01T00:00:00',
				estado: 'VIGENTE',
			},
		],
		...extras,
	}
}

const RESPUESTA: ObtenerPanelEstudiosResponse = {
	data: [fila(1, 'Condominio Las Torres'), fila(2, 'Edificio Alameda')],
	contadores: {
		cotizaciones_vigentes: 4,
		cotizaciones_por_vencer: 7,
		cotizaciones_vencidas: 9,
		estudios_pendientes: 2,
		estudios_emitidos: 5,
	},
	total: 23,
	pagina: 1,
	tamano_pagina: 10,
	total_paginas: 3,
}

const USUARIOS = [
	{
		rut: '11111111-1',
		nombre: 'Ana Pérez',
		roles: [{ codigo: 'EJECUTIVO_COMERCIAL' }],
	},
]

function ultimaLlamada() {
	return usePanelEstudiosMock.mock.calls.at(-1)?.[0]
}

function montar() {
	return render(<PanelCotizacionesEstudiosClient initialData={RESPUESTA} />)
}

beforeEach(() => {
	usePanelEstudiosMock.mockReturnValue({
		data: RESPUESTA,
		isLoading: false,
		isFetching: false,
		error: null,
	} as unknown as ReturnType<typeof usePanelEstudios>)
	useUsuariosMock.mockReturnValue({
		data: {
			data: USUARIOS,
			total: 1,
			pagina: 1,
			tamano_pagina: 100,
			total_paginas: 1,
		},
		isLoading: false,
	} as unknown as ReturnType<typeof useUsuarios>)
})

describe('PanelCotizacionesEstudiosClient — datos y contadores', () => {
	it('renderiza las filas de la página y los KPIs con los contadores del servidor', () => {
		montar()

		expect(screen.getAllByText('Condominio Las Torres').length).toBeGreaterThan(0)
		expect(screen.getAllByText('Edificio Alameda').length).toBeGreaterThan(0)

		expect(
			screen.getByRole('button', { name: /Cotizaciones vigentes/ }).textContent,
		).toContain('4')
		expect(
			screen.getByRole('button', { name: /Por vencer/ }).textContent,
		).toContain('7')
		expect(
			screen.getByRole('button', { name: /Vencidas/ }).textContent,
		).toContain('9')
		expect(
			screen.getByRole('button', { name: /Estudios pendientes/ }).textContent,
		).toContain('2')
		expect(
			screen.getByRole('button', { name: /Estudios finales emitidos/ }).textContent,
		).toContain('5')
	})

	it('pide la primera página con los filtros normalizados al montar', () => {
		montar()

		expect(ultimaLlamada()).toEqual({
			textoBusqueda: '',
			estado: '',
			prioridad: '',
			rutEjecutivo: '',
			pagina: 1,
			tamanoPagina: 10,
		})
	})
})

describe('PanelCotizacionesEstudiosClient — filtros', () => {
	it('la búsqueda de texto llega al hook como textoBusqueda', async () => {
		const user = userEvent.setup()
		montar()

		await user.type(
			screen.getByPlaceholderText('Buscar por cliente, producto o ejecutivo…'),
			'torres',
		)

		expect(ultimaLlamada()).toMatchObject({ textoBusqueda: 'torres', pagina: 1 })
	})

	it('seleccionar un estado envía el estado normalizado', async () => {
		const user = userEvent.setup()
		montar()

		await user.click(screen.getByRole('combobox', { name: 'Estado' }))
		await user.click(await screen.findByRole('option', { name: 'Vencidas' }))

		expect(ultimaLlamada()).toMatchObject({
			estado: 'cotizaciones_vencidas',
			pagina: 1,
		})
	})

	it('seleccionar una prioridad envía la prioridad normalizada', async () => {
		const user = userEvent.setup()
		montar()

		await user.click(screen.getByRole('combobox', { name: 'Prioridad' }))
		await user.click(await screen.findByRole('option', { name: 'Alta' }))

		expect(ultimaLlamada()).toMatchObject({ prioridad: 'alta', pagina: 1 })
	})

	it('elegir un ejecutivo envía su rut como rutEjecutivo', async () => {
		const user = userEvent.setup()
		montar()

		await user.click(screen.getByRole('combobox', { name: 'Usuario' }))
		await user.click(await screen.findByRole('option', { name: 'Ana Pérez' }))

		expect(ultimaLlamada()).toMatchObject({
			rutEjecutivo: '11111111-1',
			pagina: 1,
		})
	})
})

describe('PanelCotizacionesEstudiosClient — KPIs y paginación', () => {
	it('el click en una tarjeta KPI filtra por ese estado y un segundo click lo quita', async () => {
		const user = userEvent.setup()
		montar()

		await user.click(
			screen.getByRole('button', { name: /Cotizaciones vigentes/ }),
		)
		expect(ultimaLlamada()).toMatchObject({ estado: 'cotizaciones_vigentes' })

		await user.click(
			screen.getByRole('button', { name: /Cotizaciones vigentes/ }),
		)
		expect(ultimaLlamada()).toMatchObject({ estado: '' })
	})

	it('cambiar de página mantiene los filtros y cambiar un filtro vuelve a la página 1', async () => {
		const user = userEvent.setup()
		montar()

		await user.click(screen.getByRole('combobox', { name: 'Prioridad' }))
		await user.click(await screen.findByRole('option', { name: 'Alta' }))
		expect(ultimaLlamada()).toMatchObject({ prioridad: 'alta', pagina: 1 })

		await user.click(screen.getByRole('button', { name: '3' }))
		expect(ultimaLlamada()).toMatchObject({ prioridad: 'alta', pagina: 3 })

		await user.click(screen.getByRole('combobox', { name: 'Estado' }))
		await user.click(
			await screen.findByRole('option', { name: 'Estudios pendientes' }),
		)
		expect(ultimaLlamada()).toMatchObject({
			estado: 'estudios_pendientes',
			prioridad: 'alta',
			pagina: 1,
		})
	})

	it('muestra las filas de la página actual y el total del servidor', () => {
		montar()

		expect(screen.getByText('Mostrando 2 de 23 cotizaciones')).toBeInTheDocument()
	})
})
