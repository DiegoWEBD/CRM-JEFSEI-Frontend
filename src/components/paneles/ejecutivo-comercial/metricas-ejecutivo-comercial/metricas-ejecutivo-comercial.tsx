'use client'

import { useMetricasEjecutivoComercial } from '@/hooks/metricas/use-metricas-ejecutivo-comercial'
import VisualizadorComisionEjecutivo from '@/components/visualizador-comision-ejecutivo/visualizador-comision-ejecutivo'
import VisualizadorPrimaVendida from '@/components/visualizador-prima-vendida/visualizador-prima-vendida'

export default function MetricasEjecutivoComercial() {
	const { data, isLoading } = useMetricasEjecutivoComercial()

	return (
		<div
			className='flex shrink-0 flex-wrap justify-end gap-2'
			aria-label='Resumen mensual del ejecutivo'
		>
			<VisualizadorPrimaVendida
				actual={data?.prima_vendida || 0}
				meta={data?.meta_mensual ?? 0}
				loading={isLoading}
			/>
			<VisualizadorComisionEjecutivo
				comision={data?.comision || 0}
				loading={isLoading}
			/>
		</div>
	)
}
