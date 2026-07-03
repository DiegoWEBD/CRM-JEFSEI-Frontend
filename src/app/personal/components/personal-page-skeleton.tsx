import { Skeleton } from '@/components/skeleton'
import { Card, CardContent } from '@/components/card'

export function PersonalPageSkeleton() {
	return (
		<div className='space-y-6'>
			<Skeleton className='h-5 w-48 rounded-md' />
			<Skeleton className='h-9 w-full rounded-md' />
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{Array.from({ length: 6 }).map((_, i) => (
					<Card key={i}>
						<CardContent className='flex items-start gap-3 p-4'>
							<Skeleton className='size-10 shrink-0 rounded-full' />
							<div className='min-w-0 flex-1 space-y-2'>
								<Skeleton className='h-5 w-3/4 rounded-md' />
								<Skeleton className='h-3 w-1/2 rounded-md' />
								<Skeleton className='h-3 w-2/3 rounded-md' />
								<Skeleton className='h-3 w-1/3 rounded-md' />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
