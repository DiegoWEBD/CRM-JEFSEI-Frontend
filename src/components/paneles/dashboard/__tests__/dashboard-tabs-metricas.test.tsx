import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
	useSearchParams: () => new URLSearchParams(window.location.search),
}))
vi.mock('axios', () => ({ default: { get: vi.fn() } }))

import DashboardTabs from '../dashboard-tabs'
import { FiltrosDashboardProvider } from '../filtros-dashboard-context'
import QuotedPremiumCardClient from '../contents/pipeline-oportunidades/quoted-premium-card-client'
import MonthlyNetPremiumCardClient from '../contents/produccion/monthly-net-premium-card-client'

const axiosGetMock = vi.mocked(axios.get)

const urlsLlamadas = () => axiosGetMock.mock.calls.map((c) => c[0] as string)

function arbol() {
	return (
		<FiltrosDashboardProvider filtrosIniciales={{ mes: 11, year: 2026 }}>
			<DashboardTabs
				pipeline={<QuotedPremiumCardClient />}
				produccion={<MonthlyNetPremiumCardClient />}
			/>
		</FiltrosDashboardProvider>
	)
}

beforeEach(() => {
	axiosGetMock.mockReset()
	axiosGetMock.mockImplementation(async (url: string) => {
		if (url === '/api/metricas/prima-cotizada') {
			return { data: { prima_cotizada: 100 } }
		}
		return {
			data: {
				total_prima_neta: 100,
				variacion_mes_anterior: 0,
				mes_label: 'Noviembre 2026',
			},
		}
	})
	window.history.replaceState(null, '', '/')
})

describe('DashboardTabs — fetch de métricas por pestaña', () => {
	it('solo fetchea las métricas de la pestaña activa; la otra al cambiar', async () => {
		const view = render(arbol())

		await waitFor(() =>
			expect(urlsLlamadas()).toContain('/api/metricas/prima-cotizada'),
		)
		expect(urlsLlamadas()).not.toContain('/api/metricas/prima-neta-mensual')
		expect(screen.getByText('Prima cotizada')).toBeInTheDocument()

		fireEvent.mouseDown(
			screen.getByRole('tab', { name: /producción comercial/i }),
		)
		// El router de Next re-renderiza con la nueva URL; aquí se simula.
		view.rerender(arbol())

		await waitFor(() =>
			expect(urlsLlamadas()).toContain('/api/metricas/prima-neta-mensual'),
		)
		expect(screen.getByText('Prima neta mensual')).toBeInTheDocument()
		expect(screen.getByText('Noviembre 2026')).toBeInTheDocument()
	})
})
