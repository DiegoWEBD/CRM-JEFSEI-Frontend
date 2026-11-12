import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/usuarios/use-usuarios', () => ({
	useUsuarios: vi.fn(),
}))

import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import FiltrosSolicitudesEstudio, {
	TODOS,
	type FiltrosSolicitudes,
} from '../filtros-solicitudes-estudio'

const useUsuariosMock = vi.mocked(useUsuarios)

const FILTROS_INICIALES: FiltrosSolicitudes = {
	busqueda: '',
	estado: TODOS,
	prioridad: TODOS,
	rutUsuario: '',
}

const USUARIOS = [
	{
		rut: '11111111-1',
		nombre: 'Ana Pérez',
		roles: [{ codigo: 'EJECUTIVO_COMERCIAL' }],
	},
]

function montar(filtros: FiltrosSolicitudes = FILTROS_INICIALES, onChange = vi.fn()) {
	render(
		<FiltrosSolicitudesEstudio
			filtros={filtros}
			onChange={onChange}
			total={23}
			filtrados={2}
		/>,
	)
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

describe('FiltrosSolicitudesEstudio — estados', () => {
	it('ofrece exactamente los cuatro estados nuevos', async () => {
		const user = userEvent.setup()
		montar()

		await user.click(screen.getByRole('combobox', { name: 'Estado' }))

		const opciones = await screen.findAllByRole('option')
		expect(opciones.map(o => o.textContent?.trim())).toEqual([
			'Estado: todos',
			'Información incompleta',
			'Listas para cotizar',
			'Cotizaciones emitidas',
			'Estudios emitidos',
		])
	})

	it('emite el estado seleccionado por onChange', async () => {
		const user = userEvent.setup()
		const onChange = montar()

		await user.click(screen.getByRole('combobox', { name: 'Estado' }))
		await user.click(await screen.findByRole('option', { name: 'Listas para cotizar' }))

		expect(onChange).toHaveBeenCalledWith({
			...FILTROS_INICIALES,
			estado: 'listas_para_cotizar',
		})
	})
})

describe('FiltrosSolicitudesEstudio — prioridad y usuario', () => {
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

	it('el filtro de usuario emite el rut elegido', async () => {
		const user = userEvent.setup()
		const onChange = montar()

		await user.click(screen.getByRole('combobox', { name: 'Usuario' }))
		await user.click(await screen.findByRole('option', { name: 'Ana Pérez' }))

		expect(onChange).toHaveBeenCalledWith({
			...FILTROS_INICIALES,
			rutUsuario: '11111111-1',
		})
	})

	it('no renderiza el filtro de línea', () => {
		montar()

		expect(screen.queryByText('Línea: todos')).toBeNull()
		expect(screen.queryByRole('combobox', { name: 'Línea' })).toBeNull()
	})
})

describe('FiltrosSolicitudesEstudio — limpiar', () => {
	it('no muestra Limpiar sin filtros activos', () => {
		montar()

		expect(screen.queryByRole('button', { name: /Limpiar/ })).toBeNull()
	})

	it('Limpiar emite los filtros por defecto', async () => {
		const user = userEvent.setup()
		const onChange = montar({
			busqueda: 'torres',
			estado: 'cotizaciones_emitidas',
			prioridad: 'alta',
			rutUsuario: '11111111-1',
		})

		await user.click(screen.getByRole('button', { name: /Limpiar/ }))

		expect(onChange).toHaveBeenCalledWith(FILTROS_INICIALES)
	})
})
