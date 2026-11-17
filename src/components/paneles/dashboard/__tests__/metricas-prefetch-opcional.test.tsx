import { HydrationBoundary } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

const consultarPrimaCotizada = vi.fn()
const consultarTendenciaAnual = vi.fn()

vi.mock('@/aplicacion/metricas/consultas-dashboard', () => ({
	consultarPrimaCotizada: (...args: unknown[]) => consultarPrimaCotizada(...args),
	consultarTendenciaAnual: (...args: unknown[]) => consultarTendenciaAnual(...args),
}))

import QuotedPremiumCard from '../contents/pipeline-oportunidades/quoted-premium-card'
import QuotedPremiumCardClient from '../contents/pipeline-oportunidades/quoted-premium-card-client'
import MonthlyNetPremiumTrendChart from '../contents/produccion/monthly-net-premium-trend-chart'
import MonthlyNetPremiumTrendChartClient from '../contents/produccion/monthly-net-premium-trend-chart-client'

describe('Wrappers de métricas — prefetch SSR opcional', () => {
	it('con prefetch=false renderiza el cliente directo sin fetch server-side', async () => {
		const elemento = await QuotedPremiumCard({ prefetch: false })

		expect(consultarPrimaCotizada).not.toHaveBeenCalled()
		expect(elemento.type).toBe(QuotedPremiumCardClient)
	})

	it('con prefetch=false pasa el className al cliente (gráfico)', async () => {
		const elemento = await MonthlyNetPremiumTrendChart({
			className: 'alto',
			prefetch: false,
		})

		expect(consultarTendenciaAnual).not.toHaveBeenCalled()
		expect(elemento.type).toBe(MonthlyNetPremiumTrendChartClient)
		expect(elemento.props.className).toBe('alto')
	})

	it('con prefetch=true hace el prefetch SSR y envuelve en HydrationBoundary', async () => {
		const elemento = await QuotedPremiumCard({ prefetch: true })

		expect(consultarPrimaCotizada).toHaveBeenCalled()
		expect(elemento.type).toBe(HydrationBoundary)
	})
})
