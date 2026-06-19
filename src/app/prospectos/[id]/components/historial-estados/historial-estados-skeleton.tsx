import { Card, CardHeader } from '@/components/card'
import { Skeleton } from '@/components/skeleton'

type HistorialEstadosSkeletonProps = {
	cantidad?: number
}

const HistorialEstadosSkeleton = ({
	cantidad = 4,
}: HistorialEstadosSkeletonProps) => {
	return (
		<Card>
			<CardHeader title='Historial de Acciones' />

			<div className='space-y-8 animate-pulse'>
				{Array.from({ length: cantidad }).map((_, index) => (
					<div key={`historial-skeleton-${index}`} className='flex gap-4'>
						<div className='flex flex-col items-center'>
							<Skeleton className='h-4 w-4 rounded-full' />

							{index !== cantidad - 1 && (
								<Skeleton className='w-px flex-1 min-h-20 mt-2' />
							)}
						</div>

						<div className='flex-1 pb-2'>
							<div className='flex items-center justify-between gap-4'>
								<Skeleton className='h-5 w-40' />
								<Skeleton className='h-4 w-24' />
							</div>

							<div className='mt-3'>
								<Skeleton className='h-4 w-2/3' />
							</div>

							<div className='mt-2'>
								<Skeleton className='h-4 w-1/3' />
							</div>
						</div>
					</div>
				))}
			</div>
		</Card>
	)
}

export default HistorialEstadosSkeleton
