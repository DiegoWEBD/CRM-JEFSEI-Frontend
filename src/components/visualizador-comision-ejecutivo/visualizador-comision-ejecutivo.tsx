import { normalizarNumeroFormatoChileno } from '@/utils/normalizar-numero-formato-chileno'
import { Coins } from 'lucide-react'
import MetricaSmall from '../metrica-small/metrica-small'

type VisualizadorComisionEjecutivoProps = {
	comision: number
}

export default function VisualizadorComisionEjecutivo({
	comision,
}: VisualizadorComisionEjecutivoProps) {
	return (
		<MetricaSmall
			icon={Coins}
			label='Prima vendida del mes'
			className='min-w-37'
		>
			CLP {normalizarNumeroFormatoChileno(comision)}
		</MetricaSmall>
	)
}
