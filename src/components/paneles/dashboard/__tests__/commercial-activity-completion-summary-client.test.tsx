import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))

import { FiltrosDashboardProvider } from '../filtros-dashboard-context'
import CommercialActivityCompletionSummaryClient from '../contents/actividades-comerciales/commercial-activity-completion-summary-client'

const axiosGetMock = vi.mocked(axios.get)

function renderSummary(queryClient: QueryClient) {
	return render(
		<QueryClientProvider client={queryClient}>
			<FiltrosDashboardProvider filtrosIniciales={{ mes: 11, year: 2026 }}>
				<CommercialActivityCompletionSummaryClient />
			</FiltrosDashboardProvider>
		</QueryClientProvider>,
	)
}

beforeEach(() => {
	axiosGetMock.mockReset()
})

describe('CommercialActivityCompletionSummaryClient — anidamiento del skeleton', () => {
	it('en carga el skeleton no se anida dentro de un <p> (hidratación segura)', async () => {
		// Fetch pendiente: el estado de carga se mantiene durante las aserciones.
		axiosGetMock.mockImplementation(() => new Promise(() => {}))
		const queryClient = new QueryClient()

		const { container } = renderSummary(queryClient)

		expect(screen.getByText('Gestiones concretadas')).toBeInTheDocument()
		expect(screen.getByText(/Total visible:/)).toBeInTheDocument()
		// Un <div> (Skeleton) dentro de <p> rompe la hidratación de Next.js.
		expect(container.querySelector('p div')).toBeNull()
		expect(
			container.querySelectorAll('[data-slot="skeleton"]').length,
		).toBeGreaterThan(0)
	})

	it('con datos renderiza los contadores sin anidamientos inválidos', async () => {
		axiosGetMock.mockResolvedValue({
			data: {
				agendadas: 10,
				concretadas: 4,
				pendientes: 6,
				porcentaje_cumplimiento: 40,
			},
		})
		const queryClient = new QueryClient()

		const { container } = renderSummary(queryClient)

		await waitFor(() =>
			expect(screen.getByText('40% cumplimiento')).toBeInTheDocument(),
		)
		expect(screen.getAllByText('10').length).toBeGreaterThan(0)
		expect(container.querySelector('p div')).toBeNull()
	})
})
