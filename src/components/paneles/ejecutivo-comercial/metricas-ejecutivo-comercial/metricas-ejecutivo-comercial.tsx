import VisualizadorComisionEjecutivo from '@/components/visualizador-comision-ejecutivo/visualizador-comision-ejecutivo'
import VisualizadorPrimaVendida from '@/components/visualizador-prima-vendida/visualizador-prima-vendida'

export default function MetricasEjecutivoComercial() {
	return (
		<div
			className='flex shrink-0 flex-wrap justify-end gap-2'
			aria-label='Resumen mensual del ejecutivo'
		>
			<VisualizadorPrimaVendida actual={132.5} meta={600} />
			<VisualizadorComisionEjecutivo comision={253780} />
		</div>
	)
}
