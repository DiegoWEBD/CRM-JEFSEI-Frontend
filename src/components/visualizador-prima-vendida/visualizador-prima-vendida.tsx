import { TrendingUp } from 'lucide-react'
import MetricaSmall from '../metrica-small/metrica-small'
import { normalizarNumeroFormatoChileno } from '@/utils/normalizar-numero-formato-chileno'

type VisualizadorPrimaVendidaProps = {
	actual: number
	meta: number
}

export default function VisualizadorPrimaVendida({
	actual,
	meta,
}: VisualizadorPrimaVendidaProps) {
	return (
		<MetricaSmall
			icon={TrendingUp}
			label='Prima vendida del mes'
			className='min-w-34.5'
		>
			<span>UF {normalizarNumeroFormatoChileno(actual)}</span>
			<span className='font-normal text-muted-foreground'> / </span>
			<span className='font-medium text-muted-foreground'>
				UF {normalizarNumeroFormatoChileno(meta)}
			</span>
		</MetricaSmall>
	)
}
