import { Skeleton } from '@/components/skeleton'

export default function ProspectoHeroHeaderSkeleton() {
	return (
		<section className='rounded-xl border border-border bg-card'>
			<div className='p-4 sm:p-5 lg:p-6'>
				{/* Breadcrumb */}
				<Skeleton className='mb-4 h-4 w-48' />

				<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
					{/* Left */}
					<div className='min-w-0 flex-1'>
						<div className='flex items-start gap-3 sm:gap-4'>
							<Skeleton className='h-14 w-14 shrink-0 rounded-xl' />
							<div className='min-w-0 flex-1 space-y-2'>
								<Skeleton className='h-7 w-3/4' />
								<div className='flex gap-2'>
									<Skeleton className='h-5 w-20' />
									<Skeleton className='h-5 w-16' />
									<Skeleton className='h-5 w-24' />
								</div>
							</div>
						</div>
					</div>

					{/* Right: KPIs */}
					<div className='grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:shrink-0 lg:grid-cols-2 xl:grid-cols-4'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className='flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5'
							>
								<Skeleton className='h-9 w-9 shrink-0 rounded-md' />
								<div className='space-y-1'>
									<Skeleton className='h-3 w-16' />
									<Skeleton className='h-5 w-12' />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
