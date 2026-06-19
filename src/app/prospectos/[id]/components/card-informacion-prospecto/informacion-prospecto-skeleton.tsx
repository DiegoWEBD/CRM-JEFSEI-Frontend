import { Card, CardHeader } from '@/components/card'
import { Skeleton } from '@/components/skeleton'

const InformacionProspectoSkeleton = () => {
	return (
		<Card>
			<CardHeader title='Información del Prospecto' />

			<div className='flex flex-col gap-4 xl:flex-row animate-pulse'>
				<div className='flex-1 border border-border rounded-xl p-4'>
					<div className='flex items-center gap-3 mb-4'>
						<Skeleton className='h-5 w-5 rounded' />
						<Skeleton className='h-4 w-24' />
					</div>

					<Skeleton className='h-5 w-40' />
				</div>

				<div className='flex-1 border border-border rounded-xl p-4'>
					<div className='flex items-center gap-3 mb-4'>
						<Skeleton className='h-5 w-5 rounded' />
						<Skeleton className='h-4 w-20' />
					</div>

					<Skeleton className='h-5 w-56' />
				</div>
			</div>
		</Card>
	)
}

export default InformacionProspectoSkeleton
