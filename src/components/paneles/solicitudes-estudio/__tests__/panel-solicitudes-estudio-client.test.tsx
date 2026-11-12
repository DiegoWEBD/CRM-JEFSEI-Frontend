import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/solicitudes-cotizacion/use-obtener-todas-solicitudes-cotizacion', () => ({
	useObtenerTodasSolicitudesCotizacion: vi.fn(),
}))
vi.mock('@/hooks/usuarios/use-usuarios', () => ({
	useUsuarios: vi.fn(),
}))
vi.mock('@/hooks/use-debounce', () => ({
	useDebounce: (valor: string) => valor,
}))
vi.mock('../sheet-detalle-solicitud', () => ({ default: () => null }))

import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import { useObtenerTodasSolicitudesCotizacion } from '@/hooks/solicitudes-cotizacion/use-obtener-todas-solicitudes-cotizacion'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import PanelSolicitudesEstudioClient from '../panel-solicitudes-estudio-client'

const useObtenerMock = vi.mocked(useObtenerTodasSolicitudesCotizacion)
const useUsuariosMock = vi.mocked(useUsuarios)

function resumen(
	id: number,
	nombreRiesgo: string,
	extras: Partial<{
		informacion_completa: boolean
		tiene_cotizaciones: boolean
		estudio_disponible: boolean
	}> = {},
): SolicitudCotizacionResumen {
	return new SolicitudCotizacionResumen(
		id,
		id + 100,
		nombreRiesgo,
		extras.informacion_completa ?? true,
		'Ana Pérez',
		'incendio',
		'Incendio Condominio',
		'alta',
		'2026-11-10T10:00:00',
		extras.tiene_cotizaciones ?? false,
		[],
		false,
		null,
		extras.estudio_disponible ?? false,
	)
}

const RESPUESTA = {
	data: [resumen(1, 'Condominio Las Torres'), resumen(2, 'Edificio Alameda')],
	contadores: {
		informacion_incompleta: 4,
		listas_para_cotizar: 7,
		cotizaciones_emitidas: 9,
		estudios_emitidos: 2,
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
	return useObtenerMock.mock.calls.at(-1)?.[0]
}

function montar() {
	return render(<PanelSolicitudesEstudioClient initialData={RESPUESTA} />)
}

beforeEach(() => {
	useObtenerMock.mockReturnValue({
		data: RESPUESTA,
		isLoading: false,
		isFetching: false,
		error: null,
	} as unknown as ReturnType<typeof useObtenerTodasSolicitudesCotizacion>)
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

describe('PanelSolicitudesEstudioClient — datos y contadores', () => {
	it('renderiza las filas de la página y los KPIs con los contadores del servidor', () => {
		montar()

		expect(screen.getAllByText('Condominio Las Torres').length).toBeGreaterThan(0)
		expect(screen.getAllByText('Edificio Alameda').length).toBeGreaterThan(0)

		expect(
			screen.getByRole('button', { name: /Información incompleta/ }).textContent,
		).toContain('4')
		expect(
			screen.getByRole('button', { name: /Listas para cotizar/ }).textContent,
		).toContain('7')
		expect(
			screen.getByRole('button', { name: /Cotizaciones emitidas/ }).textContent,
		).toContain('9')
		expect(
			screen.getByRole('button', { name: /Estudios emitidos/ }).textContent,
		).toContain('2')
	})

	it('pide la primera página con los filtros normalizados al montar', () => {
		montar()

		expect(ultimaLlamada()).toEqual({
			textoBusqueda: '',
			estado: '',
			prioridad: '',
			rutUsuario: '',
			pagina: 1,
			tamanoPagina: 10,
		})
	})
})

describe('PanelSolicitudesEstudioClient — filtros', () => {
	it('la búsqueda de texto llega al hook como textoBusqueda', async () => {
		const user = userEvent.setup()
		montar()

		await user.type(
			screen.getByPlaceholderText('Buscar por cliente, línea de seguro o ejecutivo…'),
			'torres',
		)

		expect(ultimaLlamada()).toMatchObject({ textoBusqueda: 'torres', pagina: 1 })
	})

	it('seleccionar un estado envía el estado normalizado', async () => {
		const user = userEvent.setup()
		montar()

		await user.click(screen.getByRole('combobox', { name: 'Estado' }))
		await user.click(
			await screen.findByRole('option', { name: 'Cotizaciones emitidas' }),
		)

		expect(ultimaLlamada()).toMatchObject({
			estado: 'cotizaciones_emitidas',
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

	it('elegir un ejecutivo envía su rut como rutUsuario', async () => {
		const user = userEvent.setup()
		montar()

		await user.click(screen.getByRole('combobox', { name: 'Usuario' }))
		await user.click(await screen.findByRole('option', { name: 'Ana Pérez' }))

		expect(ultimaLlamada()).toMatchObject({
			rutUsuario: '11111111-1',
			pagina: 1,
		})
	})

	it('no muestra el filtro de línea', () => {
		montar()

		expect(screen.queryByText('Línea: todos')).toBeNull()
		expect(screen.queryByRole('combobox', { name: 'Línea' })).toBeNull()
	})
})

describe('PanelSolicitudesEstudioClient — KPIs y paginación', () => {
	it('el click en una tarjeta KPI filtra por ese estado y un segundo click lo quita', async () => {
		const user = userEvent.setup()
		montar()

		await user.click(
			screen.getByRole('button', { name: /Cotizaciones emitidas/ }),
		)
		expect(ultimaLlamada()).toMatchObject({ estado: 'cotizaciones_emitidas' })

		await user.click(
			screen.getByRole('button', { name: /Cotizaciones emitidas/ }),
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
		await user.click(await screen.findByRole('option', { name: 'Estudios emitidos' }))
		expect(ultimaLlamada()).toMatchObject({
			estado: 'estudios_emitidos',
			prioridad: 'alta',
			pagina: 1,
		})
	})

	it('muestra 10 skeletons de fila mientras se hace un fetch client-side', () => {
		useObtenerMock.mockReturnValue({
			data: RESPUESTA,
			isLoading: false,
			isFetching: true,
			error: null,
		} as unknown as ReturnType<typeof useObtenerTodasSolicitudesCotizacion>)

		montar()

		// 1 fila de header + 10 filas skeleton.
		expect(screen.getAllByRole('row')).toHaveLength(11)
		expect(screen.queryByText('Condominio Las Torres')).toBeNull()
	})

	it('muestra las filas de la página actual y el total del servidor', () => {
		montar()

		expect(screen.getByText('Mostrando 2 de 23 solicitudes')).toBeInTheDocument()
	})
})
