'use client'

import { useMetricasEjecutivoComercial } from '@/hooks/metricas/use-metricas-ejecutivo-comercial'
import VisualizadorComisionEjecutivo from '@/components/visualizador-comision-ejecutivo/visualizador-comision-ejecutivo'
import VisualizadorPrimaVendida from '@/components/visualizador-prima-vendida/visualizador-prima-vendida'
import { Skeleton } from '@/components/skeleton'

export default function MetricasEjecutivoComercial() {
	const { data, isLoading } = useMetricasEjecutivoComercial({
		prima_vendida: 0,
		meta_mensual: 0,
		comision: 0,
	})

	if (isLoading) {
		return (
			<div
				className='flex shrink-0 flex-wrap justify-end gap-2'
				aria-label='Resumen mensual del ejecutivo'
			>
				<Skeleton className='h-12 w-40 rounded-md' />
				<Skeleton className='h-12 w-36 rounded-md' />
			</div>
		)
	}

	return (
		<div
			className='flex shrink-0 flex-wrap justify-end gap-2'
			aria-label='Resumen mensual del ejecutivo'
		>
			<VisualizadorPrimaVendida
				actual={data.prima_vendida}
				meta={data.meta_mensual ?? 0}
			/>
			<VisualizadorComisionEjecutivo comision={data.comision} />
		</div>
	)
}
