import { Skeleton } from '@/components/skeleton'

export default function ConfiguracionEstadosSkeleton() {
	return (
		<div className='mx-auto grid gap-8'>
			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-3 sm:p-4'>
					<div className='flex flex-wrap items-center gap-2'>
						<Skeleton className='h-9 w-full flex-1 min-w-[200px]' />
					</div>
					<Skeleton className='mt-3 h-4 w-32' />
				</div>

				<div className='space-y-2 p-3 sm:p-4'>
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className='h-12 w-full rounded-md' />
					))}
				</div>
			</section>
		</div>
	)
}
