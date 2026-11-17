import { HydrationBoundary } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

// Los mocks deben resolver datos: React Query v5 rechaza el `undefined`.
const consultarPrimaCotizada = vi
	.fn()
	.mockResolvedValue({ prima_cotizada: 100 })
const consultarPrimaNetaMensual = vi.fn().mockResolvedValue({
	total_prima_neta: 100,
	variacion_mes_anterior: 0,
	mes_label: 'Mayo 2026',
})
const consultarTendenciaAnual = vi
	.fn()
	.mockResolvedValue([{ mes: '2026-05', prima_neta: 100 }])

vi.mock('@/aplicacion/metricas/consultas-dashboard', () => ({
	consultarPrimaCotizada: (...args: unknown[]) => consultarPrimaCotizada(...args),
	consultarPrimaNetaMensual: (...args: unknown[]) => consultarPrimaNetaMensual(...args),
	consultarTendenciaAnual: (...args: unknown[]) => consultarTendenciaAnual(...args),
}))

import QuotedPremiumCard from '../contents/pipeline-oportunidades/quoted-premium-card'
import QuotedPremiumCardClient from '../contents/pipeline-oportunidades/quoted-premium-card-client'
import MonthlyNetPremiumCard from '../contents/produccion/monthly-net-premium-card'
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

	it('con prefetch=true usa los filtros de la URL para el prefetch', async () => {
		await MonthlyNetPremiumCard({
			prefetch: true,
			filtros: { mes: 5, year: 2026 },
		})

		expect(consultarPrimaNetaMensual).toHaveBeenCalledWith(5, 2026)
	})
})
