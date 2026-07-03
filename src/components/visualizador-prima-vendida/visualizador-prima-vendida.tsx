import { TrendingUp } from 'lucide-react'
import MetricaSmall from '../metrica-small/metrica-small'
import { Skeleton } from '../skeleton'
import { normalizarNumeroFormatoChileno } from '@/utils/normalizar-numero-formato-chileno'

type VisualizadorPrimaVendidaProps = {
	actual: number
	meta: number
	loading?: boolean
}

export default function VisualizadorPrimaVendida({
	actual,
	meta,
	loading,
}: VisualizadorPrimaVendidaProps) {
	return (
		<MetricaSmall
			icon={TrendingUp}
			label='Prima vendida del mes'
			className='min-w-34.5'
		>
			<span>
				UF{' '}
				{loading ? (
					<Skeleton className='inline-block h-4 w-16 align-middle' />
				) : (
					normalizarNumeroFormatoChileno(actual)
				)}
			</span>
			<span className='font-normal text-muted-foreground'> / </span>
			<span className='font-medium text-muted-foreground'>
				UF{' '}
				{loading ? (
					<Skeleton className='inline-block h-4 w-16 align-middle' />
				) : (
					normalizarNumeroFormatoChileno(meta)
				)}
			</span>
		</MetricaSmall>
	)
}
