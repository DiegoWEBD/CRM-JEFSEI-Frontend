import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/usuarios/use-usuarios', () => ({
	useUsuarios: vi.fn(),
}))

import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import FiltrosCotizacionesEstudios, {
	TODOS,
	type FiltrosPanel,
} from '../filtros-cotizaciones-estudios'

const useUsuariosMock = vi.mocked(useUsuarios)

const FILTROS_INICIALES: FiltrosPanel = {
	busqueda: '',
	estado: TODOS,
	prioridad: TODOS,
	rutEjecutivo: '',
}

const USUARIOS = [
	{
		rut: '11111111-1',
		nombre: 'Ana Pérez',
		roles: [{ codigo: 'EJECUTIVO_COMERCIAL' }],
	},
]

function montar(filtros: FiltrosPanel = FILTROS_INICIALES, onChange = vi.fn()) {
	// Wrapper controlado: el input de búsqueda es controlado y necesita que el
	// valor emitido por onChange vuelva como prop para acumular las teclas.
	function FiltrosControlados() {
		const [actuales, setActuales] = useState<FiltrosPanel>(filtros)
		return (
			<FiltrosCotizacionesEstudios
				filtros={actuales}
				onChange={nuevos => {
					setActuales(nuevos)
					onChange(nuevos)
				}}
				total={23}
				filtrados={2}
			/>
		)
	}
	render(<FiltrosControlados />)
	return onChange
}

beforeEach(() => {
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

describe('FiltrosCotizacionesEstudios — estados', () => {
	it('ofrece exactamente los cinco estados del panel', async () => {
		const user = userEvent.setup()
		montar()

		await user.click(screen.getByRole('combobox', { name: 'Estado' }))

		const opciones = await screen.findAllByRole('option')
		expect(opciones.map(o => o.textContent?.trim())).toEqual([
			'Estado: todos',
			'Cotizaciones vigentes',
			'Por vencer',
			'Vencidas',
			'Estudios pendientes',
			'Estudios finales emitidos',
		])
	})

	it('emite el estado seleccionado por onChange', async () => {
		const user = userEvent.setup()
		const onChange = montar()

		await user.click(screen.getByRole('combobox', { name: 'Estado' }))
		await user.click(await screen.findByRole('option', { name: 'Vencidas' }))

		expect(onChange).toHaveBeenCalledWith({
			...FILTROS_INICIALES,
			estado: 'cotizaciones_vencidas',
		})
	})
})

describe('FiltrosCotizacionesEstudios — búsqueda, prioridad y ejecutivo', () => {
	it('emite el texto de búsqueda por onChange', async () => {
		const user = userEvent.setup()
		const onChange = montar()

		await user.type(
			screen.getByPlaceholderText('Buscar por cliente, producto o ejecutivo…'),
			'torres',
		)

		expect(onChange).toHaveBeenLastCalledWith({
			...FILTROS_INICIALES,
			busqueda: 'torres',
		})
	})

	it('emite la prioridad seleccionada por onChange', async () => {
		const user = userEvent.setup()
		const onChange = montar()

		await user.click(screen.getByRole('combobox', { name: 'Prioridad' }))
		await user.click(await screen.findByRole('option', { name: 'Normal' }))

		expect(onChange).toHaveBeenCalledWith({
			...FILTROS_INICIALES,
			prioridad: 'normal',
		})
	})

	it('el filtro de ejecutivo emite el rut elegido', async () => {
		const user = userEvent.setup()
		const onChange = montar()

		await user.click(screen.getByRole('combobox', { name: 'Usuario' }))
		await user.click(await screen.findByRole('option', { name: 'Ana Pérez' }))

		expect(onChange).toHaveBeenCalledWith({
			...FILTROS_INICIALES,
			rutEjecutivo: '11111111-1',
		})
	})

	it('no renderiza los filtros de estado de estudio ni línea', () => {
		montar()

		expect(screen.queryByRole('combobox', { name: 'Estado estudio' })).toBeNull()
		expect(screen.queryByRole('combobox', { name: 'Línea' })).toBeNull()
		expect(screen.queryByText('Línea: todos')).toBeNull()
	})
})

describe('FiltrosCotizacionesEstudios — limpiar', () => {
	it('no muestra Limpiar sin filtros activos', () => {
		montar()

		expect(screen.queryByRole('button', { name: /Limpiar/ })).toBeNull()
	})

	it('Limpiar emite los filtros por defecto', async () => {
		const user = userEvent.setup()
		const onChange = montar({
			busqueda: 'torres',
			estado: 'cotizaciones_vencidas',
			prioridad: 'alta',
			rutEjecutivo: '11111111-1',
		})

		await user.click(screen.getByRole('button', { name: /Limpiar/ }))

		expect(onChange).toHaveBeenCalledWith(FILTROS_INICIALES)
	})

	it('muestra el total de cotizaciones', () => {
		montar()

		expect(screen.getByText('Mostrando 2 de 23 cotizaciones')).toBeInTheDocument()
	})
})
