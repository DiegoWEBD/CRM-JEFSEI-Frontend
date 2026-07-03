import { normalizarNumeroFormatoChileno } from '@/utils/normalizar-numero-formato-chileno'
import { Coins } from 'lucide-react'
import MetricaSmall from '../metrica-small/metrica-small'
import { Skeleton } from '../skeleton'

type VisualizadorComisionEjecutivoProps = {
	comision: number
	loading?: boolean
}

export default function VisualizadorComisionEjecutivo({
	comision,
	loading,
}: VisualizadorComisionEjecutivoProps) {
	return (
		<MetricaSmall icon={Coins} label='Comisión del mes' className='min-w-37'>
			CLP{' '}
			{loading ? (
				<Skeleton className='inline-block h-4 w-20 align-middle' />
			) : (
				normalizarNumeroFormatoChileno(comision)
			)}
		</MetricaSmall>
	)
}
