import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
	useSearchParams: () => new URLSearchParams(window.location.search),
}))

import DashboardTabs from '../dashboard-tabs'
import { FiltrosDashboardProvider } from '../filtros-dashboard-context'

function arbol() {
	return (
		<FiltrosDashboardProvider filtrosIniciales={{ mes: 11, year: 2026 }}>
			<DashboardTabs
				pipeline={<p>contenido pipeline</p>}
				produccion={<p>contenido produccion</p>}
			/>
		</FiltrosDashboardProvider>
	)
}

beforeEach(() => {
	window.history.replaceState(null, '', '/')
})

describe('DashboardTabs — pestañas del dashboard', () => {
	it('sin query param abre en pipeline y no monta el contenido de producción', () => {
		render(arbol())

		expect(screen.getByText('contenido pipeline')).toBeInTheDocument()
		// Solo la pestaña activa está montada: la otra se monta al cambiar.
		expect(screen.queryByText('contenido produccion')).not.toBeInTheDocument()
		// La barra de filtros mes/año no aplica a pipeline.
		expect(screen.queryAllByRole('combobox')).toHaveLength(0)
	})

	it('con ?tab=produccion monta producción y la barra de filtros', () => {
		window.history.replaceState(null, '', '/?tab=produccion')

		render(arbol())

		expect(screen.getByText('contenido produccion')).toBeInTheDocument()
		expect(screen.queryByText('contenido pipeline')).not.toBeInTheDocument()
		// Selectores mes y año.
		expect(screen.getAllByRole('combobox')).toHaveLength(2)
	})

	it('con un query param inválido vuelve a la pestaña por defecto', () => {
		window.history.replaceState(null, '', '/?tab=no-existe')

		render(arbol())

		expect(screen.getByText('contenido pipeline')).toBeInTheDocument()
		expect(screen.queryByText('contenido produccion')).not.toBeInTheDocument()
	})

	it('cambiar de pestaña actualiza la URL con replaceState (routing superficial)', () => {
		const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

		render(arbol())

		// Radix Tabs activa la pestaña en el mousedown del disparador.
		fireEvent.mouseDown(screen.getByRole('tab', { name: /producción comercial/i }))

		expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '?tab=produccion')
	})

	it('cambiar de pestaña preserva mes y year en la URL', () => {
		window.history.replaceState(null, '', '/?tab=pipeline&mes=5&year=2026')
		const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

		render(arbol())

		fireEvent.mouseDown(screen.getByRole('tab', { name: /producción comercial/i }))

		expect(replaceStateSpy).toHaveBeenCalledWith(
			null,
			'',
			'?tab=produccion&mes=5&year=2026',
		)
	})

	it('al re-renderizar con la nueva URL monta el contenido de la otra pestaña', () => {
		const view = render(arbol())

		fireEvent.mouseDown(screen.getByRole('tab', { name: /producción comercial/i }))

		// El router de Next re-renderiza con la nueva URL; aquí se simula.
		view.rerender(arbol())

		expect(screen.getByText('contenido produccion')).toBeInTheDocument()
		expect(screen.queryByText('contenido pipeline')).not.toBeInTheDocument()
		expect(screen.getAllByRole('combobox')).toHaveLength(2)
	})
})
