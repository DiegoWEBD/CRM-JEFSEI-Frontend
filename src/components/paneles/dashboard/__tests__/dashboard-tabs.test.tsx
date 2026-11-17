import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
	useSearchParams: () => new URLSearchParams(window.location.search),
}))

import DashboardTabs from '../dashboard-tabs'
import { FiltrosDashboardProvider } from '../filtros-dashboard-context'

function renderTabs() {
	return render(
		<FiltrosDashboardProvider filtrosIniciales={{ mes: 11, year: 2026 }}>
			<DashboardTabs
				pipeline={<p>contenido pipeline</p>}
				produccion={<p>contenido produccion</p>}
			/>
		</FiltrosDashboardProvider>,
	)
}

beforeEach(() => {
	window.history.replaceState(null, '', '/')
})

describe('DashboardTabs — pestañas del dashboard', () => {
	it('sin query param abre en la pestaña pipeline comercial', () => {
		renderTabs()

		const panelPipeline = screen.getByRole('tabpanel', {
			name: /pipeline comercial/i,
		})
		const panelProduccion = screen.getByRole('tabpanel', {
			name: /producción comercial/i,
		})

		expect(panelPipeline).toHaveAttribute('data-state', 'active')
		expect(panelProduccion).toHaveAttribute('data-state', 'inactive')
		expect(screen.getByText('contenido pipeline')).toBeInTheDocument()
		// La barra de filtros mes/año no aplica a pipeline.
		expect(screen.queryAllByRole('combobox')).toHaveLength(0)
	})

	it('con ?tab=produccion muestra la pestaña de producción y la barra de filtros', () => {
		window.history.replaceState(null, '', '/?tab=produccion')

		renderTabs()

		const panelPipeline = screen.getByRole('tabpanel', {
			name: /pipeline comercial/i,
		})
		const panelProduccion = screen.getByRole('tabpanel', {
			name: /producción comercial/i,
		})

		expect(panelProduccion).toHaveAttribute('data-state', 'active')
		expect(panelPipeline).toHaveAttribute('data-state', 'inactive')
		expect(screen.getByText('contenido produccion')).toBeInTheDocument()
		// Selectores mes y año.
		expect(screen.getAllByRole('combobox')).toHaveLength(2)
	})

	it('con un query param inválido vuelve a la pestaña por defecto', () => {
		window.history.replaceState(null, '', '/?tab=no-existe')

		renderTabs()

		expect(
			screen.getByRole('tabpanel', { name: /pipeline comercial/i }),
		).toHaveAttribute('data-state', 'active')
	})

	it('cambiar de pestaña actualiza la URL con replaceState (routing superficial)', () => {
		const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

		renderTabs()

		// Radix Tabs activa la pestaña en el mousedown del disparador.
		fireEvent.mouseDown(screen.getByRole('tab', { name: /producción comercial/i }))

		expect(replaceStateSpy).toHaveBeenCalledWith(
			null,
			'',
			'?tab=produccion',
		)
	})
})
