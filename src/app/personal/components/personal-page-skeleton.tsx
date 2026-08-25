import { Skeleton } from '@/components/skeleton'

export function PersonalPageSkeleton() {
	return (
		<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
			<div className='border-b border-border/80 p-3 sm:p-4'>
				<div className='flex flex-wrap items-center gap-2'>
					<Skeleton className='h-9 min-w-[12rem] flex-1 rounded-md' />
					<Skeleton className='h-5 w-24 rounded-md' />
					<Skeleton className='h-9 w-32 rounded-md' />
				</div>
			</div>
			<div className='p-3 sm:p-4'>
				<div className='grid gap-3 sm:hidden'>
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className='h-[120px] rounded-lg' />
					))}
				</div>
				<div className='hidden sm:block'>
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className='mb-2 h-11 w-full rounded-md' />
					))}
				</div>
			</div>
		</section>
	)
}
