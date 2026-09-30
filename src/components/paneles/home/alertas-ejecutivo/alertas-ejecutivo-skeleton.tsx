import { Skeleton } from '@/components/skeleton'

export function AlertasEjecutivoSkeleton() {
	return (
		<div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
			{Array.from({ length: 2 }).map((_, i) => (
				<div
					key={i}
					className='overflow-hidden rounded-md border border-border/70'
				>
					<div className='flex items-center justify-between border-b border-border/70 px-3 py-2'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-4 w-8 rounded-full' />
					</div>
					<div className='divide-y divide-border'>
						{Array.from({ length: 3 }).map((_, j) => (
							<div key={j} className='space-y-2 px-4 py-3'>
								<Skeleton className='h-4 w-3/4' />
								<Skeleton className='h-3 w-full' />
								<Skeleton className='h-3 w-1/3' />
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
