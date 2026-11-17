import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))

import CloseRateCardClient from '../contents/pipeline-oportunidades/close-rate-card-client'
import { claveTasaCierre } from '@/hooks/metricas/query-keys-metricas'

const axiosGetMock = vi.mocked(axios.get)

function renderCard(queryClient: QueryClient) {
	return render(
		<QueryClientProvider client={queryClient}>
			<CloseRateCardClient />
		</QueryClientProvider>,
	)
}

beforeEach(() => {
	axiosGetMock.mockReset()
	axiosGetMock.mockResolvedValue({
		data: {
			tasa_cierre_pct: 70,
			oportunidades_ganadas: 7,
			oportunidades_cerradas: 10,
		},
	})
})

describe('CloseRateCardClient — hidratación y render', () => {
	it('con los datos precargados con la queryKey exacta renderiza sin fetch', async () => {
		const queryClient = new QueryClient()
		queryClient.setQueryData(claveTasaCierre(), {
			tasa_cierre_pct: 70,
			oportunidades_ganadas: 7,
			oportunidades_cerradas: 10,
		})

		renderCard(queryClient)

		expect(screen.getByText('Tasa de cierre')).toBeInTheDocument()
		expect(screen.getByText('70 %')).toBeInTheDocument()
		expect(
			screen.getByText('7 de 10 oportunidades cerradas ganadas'),
		).toBeInTheDocument()
		// Dale tiempo a un eventual refetch en montaje para descartarlo.
		await new Promise(resolve => setTimeout(resolve, 50))
		expect(axiosGetMock).not.toHaveBeenCalled()
	})

	it('sin datos precargados fetchea la métrica y muestra tasa y conteos', async () => {
		renderCard(new QueryClient())

		await waitFor(() =>
			expect(axiosGetMock).toHaveBeenCalledWith('/api/metricas/tasa-cierre'),
		)

		expect(await screen.findByText('70 %')).toBeInTheDocument()
		expect(
			screen.getByText('7 de 10 oportunidades cerradas ganadas'),
		).toBeInTheDocument()
	})
})
