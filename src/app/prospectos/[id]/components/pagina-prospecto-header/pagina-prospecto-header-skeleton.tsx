import { Card } from '@/components/card'
import { Skeleton } from '@/components/skeleton'

const PaginaProspectoHeaderSkeleton = () => {
	return (
		<Card className='flex flex-col md:flex-row gap-4 py-8 px-6 animate-pulse'>
			<div className='flex gap-6 w-full items-center'>
				<Skeleton className='h-14 w-14 shrink-0 rounded-full' />

				<div className='w-full max-w-sm'>
					<Skeleton className='h-7 w-52 mb-4' />

					<div className='flex items-center gap-2 mb-3'>
						<Skeleton className='h-4 w-4 rounded' />
						<Skeleton className='h-4 w-40' />
					</div>

					<div className='flex items-center gap-2'>
						<Skeleton className='h-4 w-4 rounded' />
						<Skeleton className='h-4 w-32' />
					</div>
				</div>
			</div>

			<div className='w-full flex flex-col md:items-end'>
				<Skeleton className='h-8 w-32 rounded-full' />

				<div className='space-y-3 mt-4 w-full md:w-fit'>
					<div className='flex gap-2 items-center md:justify-end'>
						<Skeleton className='h-4 w-4 rounded' />
						<Skeleton className='h-4 w-20' />
						<Skeleton className='h-4 w-28' />
					</div>

					<div className='flex gap-2 items-center md:justify-end'>
						<Skeleton className='h-4 w-4 rounded' />
						<Skeleton className='h-4 w-20' />
						<Skeleton className='h-4 w-28' />
					</div>
				</div>
			</div>
		</Card>
	)
}

export default PaginaProspectoHeaderSkeleton
