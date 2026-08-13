import { Skeleton } from '@/components/skeleton'

export default function CardContactosSkeleton() {
	return (
		<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3'>
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					key={i}
					className='space-y-2 rounded-md border border-border/60 p-3'
				>
					<div className='flex items-start justify-between'>
						<Skeleton className='h-3.5 w-24' />
						<Skeleton className='h-7 w-14 rounded-md' />
					</div>
					<Skeleton className='h-3 w-20' />
					<Skeleton className='h-3 w-28' />
					<Skeleton className='h-3 w-32' />
				</div>
			))}
		</div>
	)
}