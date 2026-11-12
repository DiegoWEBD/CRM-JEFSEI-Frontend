import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import TablaCotizacionesEstudios from '../tabla-cotizaciones-estudios'

function fila(id: number): PanelEstudioFila {
	return {
		id,
		id_prospecto: id + 100,
		id_proceso_comercial: id + 200,
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
				id: id * 10,
				company: 'Company',
				prima_neta: 10,
				prima_bruta: 11.9,
				fecha_vencimiento: '2026-12-01T00:00:00',
				estado: 'VIGENTE',
			},
		],
	}
}

describe('TablaCotizacionesEstudios — skeletons de fetch client-side', () => {
	it('muestra 10 filas skeleton mientras se hace un fetch', () => {
		render(
			<TablaCotizacionesEstudios filas={[]} isFetching onVerCotizaciones={vi.fn()} />,
		)

		// 1 fila de header + 10 filas skeleton dentro del shell real.
		expect(screen.getAllByRole('row')).toHaveLength(11)
		expect(
			screen.queryByText('No hay registros que coincidan con los filtros.'),
		).toBeNull()
	})

	it('no muestra los datos de la página anterior mientras se hace fetch', () => {
		render(
			<TablaCotizacionesEstudios
				filas={[fila(1)]}
				isFetching
				onVerCotizaciones={vi.fn()}
			/>,
		)

		expect(screen.queryByText('Condominio Las Torres')).toBeNull()
		expect(screen.getAllByRole('row')).toHaveLength(11)
	})

	it('muestra el mensaje vacío solo sin fetch y sin filas', () => {
		render(
			<TablaCotizacionesEstudios
				filas={[]}
				isFetching={false}
				onVerCotizaciones={vi.fn()}
			/>,
		)

		expect(
			screen.getByText('No hay registros que coincidan con los filtros.'),
		).toBeInTheDocument()
	})

	it('muestra las filas de la página cuando no hay fetch', () => {
		render(
			<TablaCotizacionesEstudios
				filas={[fila(1)]}
				isFetching={false}
				onVerCotizaciones={vi.fn()}
			/>,
		)

		expect(screen.getAllByText('Condominio Las Torres').length).toBeGreaterThan(0)
		expect(screen.getAllByRole('row')).toHaveLength(2)
	})
})
