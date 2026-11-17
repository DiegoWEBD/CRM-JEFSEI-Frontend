import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import {
	FiltrosDashboardProvider,
	useFiltrosDashboard,
} from '../filtros-dashboard-context'

function CambiadorFiltros() {
	const { setMes, setYear } = useFiltrosDashboard()
	return (
		<div>
			<button onClick={() => setMes(2)}>cambiar-mes</button>
			<button onClick={() => setYear(2027)}>cambiar-year</button>
		</div>
	)
}

function renderProvider() {
	return render(
		<FiltrosDashboardProvider filtrosIniciales={{ mes: 11, year: 2026 }}>
			<CambiadorFiltros />
		</FiltrosDashboardProvider>,
	)
}

beforeEach(() => {
	window.history.replaceState(null, '', '/?tab=produccion&mes=11&year=2026')
})

describe('FiltrosDashboardProvider — filtros en la URL', () => {
	it('cambiar mes escribe mes y year preservando el tab', () => {
		renderProvider()

		fireEvent.click(screen.getByText('cambiar-mes'))

		expect(window.location.search).toBe('?tab=produccion&mes=2&year=2026')
	})

	it('cambiar year escribe mes y year preservando el tab', () => {
		renderProvider()

		fireEvent.click(screen.getByText('cambiar-year'))

		expect(window.location.search).toBe('?tab=produccion&mes=11&year=2027')
	})
})
