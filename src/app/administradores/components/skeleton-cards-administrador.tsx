import { Card, CardContent } from '@/components/card'
import { Skeleton } from '@/components/skeleton'

function CardAdministradorSkeleton() {
	return (
		<Card className='overflow-hidden'>
			<CardContent className='p-4'>
				<div className='flex items-start gap-3'>
					<Skeleton className='size-9 shrink-0 rounded-lg' />
					<div className='min-w-0 flex-1 space-y-1.5'>
						<div className='flex items-center gap-2'>
							<Skeleton className='h-4 w-40 max-w-full' />
							<Skeleton className='h-4 w-20 shrink-0 rounded-full' />
						</div>
						<div className='flex flex-wrap gap-x-4 gap-y-1'>
							<Skeleton className='h-3 w-28' />
							<Skeleton className='h-3 w-24' />
							<Skeleton className='h-3 w-40' />
						</div>
					</div>
					<Skeleton className='h-8 w-20 shrink-0 rounded-md' />
				</div>
			</CardContent>
		</Card>
	)
}

export default function SkeletonCardsAdministrador() {
	return (
		<div className='grid gap-4 sm:grid-cols-2'>
			{Array.from({ length: 6 }).map((_, i) => (
				<CardAdministradorSkeleton key={i} />
			))}
		</div>
	)
}
