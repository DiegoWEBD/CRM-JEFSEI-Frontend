import { Card, CardContent, CardHeader } from '@/components/card'
import { Skeleton } from '@/components/skeleton'

export function PolizaPageSkeleton() {
	return (
		<div className='space-y-4'>
			<Card className='border-border shadow-none'>
				<CardHeader className='border-b border-border pb-2 pt-3'>
					<Skeleton className='h-4 w-36' />
				</CardHeader>
				<CardContent className='p-4'>
					<div className='grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3'>
						{Array.from({ length: 6 }).map((_, j) => (
							<div key={j} className='space-y-1'>
								<Skeleton className='h-3 w-20' />
								<Skeleton className='h-4 w-32' />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
			<Card className='border-border shadow-none'>
				<CardHeader className='border-b border-border pb-1 pt-2'>
					<Skeleton className='h-3 w-24' />
				</CardHeader>
				<CardContent className='p-4'>
					<div className='flex gap-2'>
						<Skeleton className='h-8 w-36 rounded-md' />
						<Skeleton className='h-8 w-36 rounded-md' />
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
