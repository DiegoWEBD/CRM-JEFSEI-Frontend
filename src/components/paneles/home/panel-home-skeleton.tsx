import { Skeleton } from '@/components/skeleton'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'

export function PanelHomeSkeleton() {
	return (
		<PanelLayout>
			<PanelHeader>
				<div className='rounded-lg border border-border bg-card shadow-none overflow-hidden'>
					<div className='border-b border-border/80 p-3 sm:p-4'>
						<Skeleton className='h-5 w-40' />
					</div>
					<div className='space-y-2 p-3 sm:p-4'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className='flex items-center gap-4'>
								<Skeleton className='h-10 w-10 rounded-md' />
								<div className='flex-1 space-y-1.5'>
									<Skeleton className='h-4 w-3/4' />
									<Skeleton className='h-3 w-1/2' />
								</div>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-6 w-20 rounded-full' />
							</div>
						))}
					</div>
				</div>
			</PanelHeader>

			<div className='rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border px-3 py-2 sm:px-4'>
					<Skeleton className='h-5 w-44' />
				</div>
				<div className='grid p-3 sm:p-4 lg:grid-cols-2 gap-4'>
					<Skeleton className='h-64 rounded-md' />
					<Skeleton className='h-64 rounded-md' />
				</div>
			</div>

			<div className='rounded-lg border border-border bg-card'>
				<div className='border-b border-border px-3 py-2 sm:px-4 flex items-center justify-between'>
					<Skeleton className='h-5 w-32' />
					<Skeleton className='h-4 w-4 rounded' />
				</div>
				<div className='grid gap-2 p-3 sm:p-4 sm:grid-cols-2 lg:grid-cols-3'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className='rounded-md border border-border/80 px-3 py-2'>
							<div className='flex items-start justify-between gap-2'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-5 w-12 rounded-md' />
							</div>
							<Skeleton className='h-3 w-full mt-2' />
							<Skeleton className='h-3 w-16 mt-1' />
						</div>
					))}
				</div>
			</div>
		</PanelLayout>
	)
}
