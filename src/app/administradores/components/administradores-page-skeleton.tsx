import { Card, CardContent } from '@/components/card'
import { Skeleton } from '@/components/skeleton'

function AdminCardSkeleton() {
	return (
		<Card className='overflow-hidden'>
			<CardContent className='p-4'>
				<div className='flex items-start gap-3'>
					<Skeleton className='size-10 shrink-0 rounded-full' />
					<div className='min-w-0 flex-1 space-y-2'>
						<Skeleton className='h-5 w-3/4' />
						<Skeleton className='h-3 w-1/2' />
						<Skeleton className='h-3 w-2/3' />
						<Skeleton className='h-3 w-1/3' />
					</div>
					<Skeleton className='h-8 w-20 shrink-0 rounded-md' />
				</div>
			</CardContent>
		</Card>
	)
}

export function AdministradoresPageSkeleton() {
	return (
		<div className='mx-auto grid gap-6'>
			<div className='space-y-6'>
				<Skeleton className='h-8 w-56' />
				<Skeleton className='h-9 w-full rounded-md' />
			</div>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{Array.from({ length: 6 }).map((_, i) => (
					<AdminCardSkeleton key={i} />
				))}
			</div>
		</div>
	)
}
