import { Skeleton } from '@/components/skeleton'

const SkeletonFilasProspecto = () => {
	return (
		<>
			{[...Array(5)].map((_, i) => (
				<div
					key={i}
					className='flex items-start justify-between gap-3 px-3 py-3'
				>
					<div className='min-w-0 flex-1 space-y-1.5'>
						<div className='flex flex-wrap items-center gap-1.5'>
							<Skeleton className='h-4 w-16 rounded-full' />
							<Skeleton className='h-4 w-24 rounded-full' />
						</div>
						<Skeleton className='h-4 w-3/4 max-w-sm' />
						<Skeleton className='h-3 w-1/2 max-w-[220px]' />
					</div>
					<Skeleton className='h-8 w-14 shrink-0 rounded-md' />
				</div>
			))}
		</>
	)
}

export default SkeletonFilasProspecto