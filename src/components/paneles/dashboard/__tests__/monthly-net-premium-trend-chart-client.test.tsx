import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))

import { FiltrosDashboardProvider } from '../filtros-dashboard-context'
import MonthlyNetPremiumTrendChartClient from '../contents/produccion/monthly-net-premium-trend-chart-client'
import { claveTendenciaAnual } from '@/hooks/metricas/query-keys-metricas'

const axiosGetMock = vi.mocked(axios.get)

function renderChart(queryClient: QueryClient) {
	return render(
		<QueryClientProvider client={queryClient}>
			<FiltrosDashboardProvider filtrosIniciales={{ mes: 11, year: 2026 }}>
				<MonthlyNetPremiumTrendChartClient />
			</FiltrosDashboardProvider>
		</QueryClientProvider>,
	)
}

beforeEach(() => {
	axiosGetMock.mockReset()
})

describe('MonthlyNetPremiumTrendChartClient — skeleton de contenido', () => {
	it('mientras carga muestra el título y skeleton solo en el área del gráfico', async () => {
		// Fetch pendiente: el estado de carga se mantiene durante las aserciones.
		axiosGetMock.mockImplementation(() => new Promise(() => {}))
		const queryClient = new QueryClient()

		renderChart(queryClient)

		expect(screen.getByText('Evolución mensual de prima neta')).toBeInTheDocument()
		expect(document.querySelector('[data-slot="skeleton"]')).not.toBeNull()

		await waitFor(() =>
			expect(axiosGetMock).toHaveBeenCalledWith(
				'/api/metricas/tendencia-anual',
				expect.objectContaining({ params: { mes: 11, year: 2026 } }),
			),
		)
	})

	it('con los datos precargados con la queryKey exacta renderiza sin skeleton', async () => {
		axiosGetMock.mockResolvedValue({ data: [] })
		const queryClient = new QueryClient()
		queryClient.setQueryData(claveTendenciaAnual({ mes: 11, year: 2026 }), [
			{ mes: '2026-11', prima_neta: 100 },
		])

		renderChart(queryClient)

		expect(screen.getByText('Evolución mensual de prima neta')).toBeInTheDocument()
		await waitFor(() =>
			expect(document.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(0),
		)
		expect(axiosGetMock).not.toHaveBeenCalled()
	})

	it('sin producción muestra el mensaje vacío con el título visible', async () => {
		axiosGetMock.mockResolvedValue({ data: [] })
		const queryClient = new QueryClient()

		renderChart(queryClient)

		await waitFor(() =>
			expect(screen.getByText('Sin datos de prima neta.')).toBeInTheDocument(),
		)
		expect(screen.getByText('Evolución mensual de prima neta')).toBeInTheDocument()
		expect(document.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(0)
	})
})
