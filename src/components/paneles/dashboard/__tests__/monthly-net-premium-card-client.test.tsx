import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))

import { FiltrosDashboardProvider, useFiltrosDashboard } from '../filtros-dashboard-context'
import MonthlyNetPremiumCardClient from '../contents/produccion/monthly-net-premium-card-client'
import { clavePrimaNetaMensual } from '@/hooks/metricas/query-keys-metricas'

const axiosGetMock = vi.mocked(axios.get)

function CambiadorFiltros() {
	const { setMes, setYear } = useFiltrosDashboard()
	return (
		<div>
			<button onClick={() => setMes(2)}>cambiar-mes</button>
			<button onClick={() => setYear(2027)}>cambiar-year</button>
		</div>
	)
}

function renderCard(queryClient: QueryClient) {
	return render(
		<QueryClientProvider client={queryClient}>
			<FiltrosDashboardProvider filtrosIniciales={{ mes: 1, year: 2026 }}>
				<CambiadorFiltros />
				<MonthlyNetPremiumCardClient />
			</FiltrosDashboardProvider>
		</QueryClientProvider>,
	)
}

beforeEach(() => {
	axiosGetMock.mockReset()
	axiosGetMock.mockImplementation(async (_url, config) => {
		const mes = (config as { params?: { mes?: number } })?.params?.mes
		return {
			data: {
				total_prima_neta: 100,
				variacion_mes_anterior: 0,
				mes_label: mes === 2 ? 'Febrero 2026' : 'Enero 2026',
			},
		}
	})
})

describe('MonthlyNetPremiumCardClient — hidratación y refetch', () => {
	it('con los datos precargados con la queryKey exacta renderiza sin fetch', async () => {
		const queryClient = new QueryClient()
		queryClient.setQueryData(clavePrimaNetaMensual({ mes: 1, year: 2026 }), {
			total_prima_neta: 100,
			variacion_mes_anterior: 0,
			mes_label: 'Enero 2026',
		})

		renderCard(queryClient)

		expect(screen.getByText('Enero 2026')).toBeInTheDocument()
		// Dale tiempo a un eventual refetch en montaje para descartarlo.
		await new Promise(resolve => setTimeout(resolve, 50))
		expect(axiosGetMock).not.toHaveBeenCalled()
	})

	it('al cambiar mes y año hace refetch al BFF con los nuevos filtros', async () => {
		const queryClient = new QueryClient()

		renderCard(queryClient)

		await waitFor(() =>
			expect(axiosGetMock).toHaveBeenCalledWith(
				'/api/metricas/prima-neta-mensual',
				expect.objectContaining({ params: { mes: 1, year: 2026 } }),
			),
		)
		await waitFor(() => expect(screen.getByText('Enero 2026')).toBeInTheDocument())

		fireEvent.click(screen.getByText('cambiar-mes'))

		await waitFor(() =>
			expect(axiosGetMock).toHaveBeenCalledWith(
				'/api/metricas/prima-neta-mensual',
				expect.objectContaining({ params: { mes: 2, year: 2026 } }),
			),
		)
		await waitFor(() => expect(screen.getByText('Febrero 2026')).toBeInTheDocument())

		fireEvent.click(screen.getByText('cambiar-year'))

		await waitFor(() =>
			expect(axiosGetMock).toHaveBeenCalledWith(
				'/api/metricas/prima-neta-mensual',
				expect.objectContaining({ params: { mes: 2, year: 2027 } }),
			),
		)
	})
})
