import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))

import {
	FiltrosDashboardProvider,
	useFiltrosDashboard,
} from '../filtros-dashboard-context'
import ExpectedPremiumCardClient from '../contents/pipeline-oportunidades/expected-premium-card-client'
import { clavePrimaEsperada } from '@/hooks/metricas/query-keys-metricas'

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
				<ExpectedPremiumCardClient />
			</FiltrosDashboardProvider>
		</QueryClientProvider>,
	)
}

beforeEach(() => {
	axiosGetMock.mockReset()
	axiosGetMock.mockResolvedValue({ data: { prima_esperada: 100 } })
})

describe('ExpectedPremiumCardClient — hidratación y filtros', () => {
	it('con los datos precargados con la queryKey exacta renderiza sin fetch', async () => {
		const queryClient = new QueryClient()
		queryClient.setQueryData(clavePrimaEsperada(), { prima_esperada: 100 })

		renderCard(queryClient)

		expect(screen.getByText('Prima esperada')).toBeInTheDocument()
		// Dale tiempo a un eventual refetch en montaje para descartarlo.
		await new Promise(resolve => setTimeout(resolve, 50))
		expect(axiosGetMock).not.toHaveBeenCalled()
	})

	it('cambiar mes y año no refetchea la métrica (no depende de los filtros)', async () => {
		const queryClient = new QueryClient()

		renderCard(queryClient)

		await waitFor(() =>
			expect(axiosGetMock).toHaveBeenCalledWith(
				'/api/metricas/prima-esperada',
			),
		)
		expect(axiosGetMock).toHaveBeenCalledTimes(1)

		fireEvent.click(screen.getByText('cambiar-mes'))
		fireEvent.click(screen.getByText('cambiar-year'))

		// Dale tiempo a un eventual refetch disparado por los filtros.
		await new Promise(resolve => setTimeout(resolve, 50))
		expect(axiosGetMock).toHaveBeenCalledTimes(1)
	})
})
