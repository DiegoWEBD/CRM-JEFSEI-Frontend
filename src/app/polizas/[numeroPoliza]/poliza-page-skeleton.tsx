import { Card, CardContent } from '@/components/card'
import { Separator } from '@/components/separator/separator'
import { Skeleton } from '@/components/skeleton'

export function PolizaPageSkeleton() {
	return (
		<div className='space-y-4'>
			<Card className='border-border shadow-none'>
				<CardContent className='p-4 sm:p-5 lg:p-6'>
					<div className='flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8'>
						<div className='min-w-0 flex-1 space-y-5'>
							<div className='flex items-start gap-3 sm:gap-4'>
								<Skeleton className='h-11 w-11 shrink-0 rounded-xl sm:h-12 sm:w-12' />
								<div className='flex-1 space-y-2'>
									<Skeleton className='h-7 w-48' />
									<div className='flex gap-2'>
										<Skeleton className='h-5 w-16 rounded-md' />
										<Skeleton className='h-5 w-20 rounded-md' />
									</div>
								</div>
							</div>

							<Separator />

							<div className='flex gap-4'>
								{Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className='flex items-center gap-2.5'>
										<Skeleton className='h-8 w-8 shrink-0 rounded-md' />
										<div className='space-y-1'>
											<Skeleton className='h-2.5 w-16' />
											<Skeleton className='h-4 w-28' />
										</div>
									</div>
								))}
							</div>
						</div>

						<Separator orientation='vertical' className='hidden self-stretch lg:block' />

						<div className='flex flex-col gap-3 lg:w-56 lg:shrink-0'>
							<Skeleton className='h-16 w-full rounded-lg' />
							<Skeleton className='h-8 w-full rounded-md' />
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className='border-border shadow-none'>
				<CardContent className='p-4 sm:p-5 lg:p-6'>
					<Skeleton className='mb-3 h-3 w-32' />
					<div className='grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3'>
						{Array.from({ length: 6 }).map((_, j) => (
							<div key={j} className='space-y-1.5'>
								<Skeleton className='h-2.5 w-20' />
								<Skeleton className='h-4 w-32' />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_30%]'>
				<Card className='border-border shadow-none'>
					<Skeleton className='h-40 w-full rounded-none' />
				</Card>
				<Card className='border-border shadow-none'>
					<Skeleton className='h-40 w-full rounded-none' />
				</Card>
			</div>
		</div>
	)
}
