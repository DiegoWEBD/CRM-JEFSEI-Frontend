import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import TablaSolicitudesEstudio from '../tabla-solicitudes-estudio'

function resumen(id: number, nombreRiesgo: string): SolicitudCotizacionResumen {
	return new SolicitudCotizacionResumen(
		id,
		id + 100,
		nombreRiesgo,
		true,
		'Ana Pérez',
		'incendio',
		'Incendio Condominio',
		'alta',
		'2026-11-10T10:00:00',
		false,
		[],
		false,
		null,
		false,
	)
}

const SOLICITUDES = [
	resumen(1, 'Condominio Las Torres'),
	resumen(2, 'Edificio Alameda'),
]

function montar(solicitudes = SOLICITUDES, isFetching = false) {
	render(
		<TablaSolicitudesEstudio
			solicitudes={solicitudes}
			isFetching={isFetching}
			onVerDetalle={() => {}}
		/>,
	)
}

describe('TablaSolicitudesEstudio — skeletons de carga', () => {
	it('muestra 10 filas skeleton y oculta las filas reales durante el fetch', () => {
		montar(SOLICITUDES, true)

		// 1 fila de header + 10 filas skeleton.
		expect(screen.getAllByRole('row')).toHaveLength(11)
		expect(screen.queryByText('Condominio Las Torres')).toBeNull()
		expect(screen.queryByText('Edificio Alameda')).toBeNull()
	})

	it('muestra 10 filas skeleton también sin datos previos', () => {
		montar([], true)

		expect(screen.getAllByRole('row')).toHaveLength(11)
		expect(
			screen.queryByText('No hay solicitudes que coincidan con los filtros.'),
		).toBeNull()
	})

	it('muestra las filas reales cuando no está haciendo fetch', () => {
		montar(SOLICITUDES, false)

		// 1 fila de header + 2 filas reales.
		expect(screen.getAllByRole('row')).toHaveLength(3)
		expect(screen.getAllByText('Condominio Las Torres').length).toBeGreaterThan(0)
		expect(screen.getAllByText('Edificio Alameda').length).toBeGreaterThan(0)
	})

	it('muestra el mensaje vacío solo sin fetch y sin filas', () => {
		montar([], false)

		expect(
			screen.getByText('No hay solicitudes que coincidan con los filtros.'),
		).toBeInTheDocument()
		expect(screen.queryAllByRole('row')).toHaveLength(0)
	})
})
