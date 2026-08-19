import { Card } from '@/components/card'
import { Separator } from '@/components/separator'
import { Skeleton } from '@/components/skeleton'

const PaginaProspectoHeaderSkeleton = () => {
	return (
		<Card className='animate-pulse border-border bg-card shadow-none'>
			<div className='flex flex-col gap-6 px-4 py-5 sm:px-5 lg:flex-row lg:gap-8 lg:px-6 lg:py-6'>
				<div className='min-w-0 flex-1 space-y-5'>
					<div className='flex items-start gap-3 sm:gap-4'>
						<Skeleton className='h-11 w-11 shrink-0 rounded-xl sm:h-12 sm:w-12' />
						<div className='w-full space-y-2 pt-1'>
							<Skeleton className='h-5 w-3/4 max-w-sm sm:h-6 lg:h-7' />
							<Skeleton className='h-5 w-1/2 max-w-[180px] sm:h-6 lg:h-7' />
							<Skeleton className='h-4 w-40' />
						</div>
					</div>

					<Separator />

					<div>
						<Skeleton className='mb-2.5 h-3 w-32' />
						<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2'>
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className='flex min-w-0 flex-col gap-3 overflow-hidden rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center'
								>
									<div className='flex min-w-0 flex-1 items-center gap-3'>
										<Skeleton className='h-10 w-10 shrink-0 rounded-md' />
										<div className='w-full space-y-1.5'>
											<Skeleton className='h-3 w-20' />
											<Skeleton className='h-4 w-28' />
										</div>
									</div>
									<Skeleton className='h-7 w-20 rounded-md' />
								</div>
							))}
						</div>
					</div>
				</div>

				<Separator
					orientation='vertical'
					className='hidden self-stretch lg:block'
				/>

				<div className='flex flex-col gap-3 lg:w-64 lg:shrink-0'>
					{[...Array(2)].map((_, i) => (
						<div
							key={i}
							className='flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3 sm:p-4 lg:flex-col lg:items-start lg:gap-2'
						>
							<Skeleton className='h-3 w-28' />
							<Skeleton className='h-5 w-24 rounded-full' />
						</div>
					))}
				</div>
			</div>
		</Card>
	)
}

export default PaginaProspectoHeaderSkeleton