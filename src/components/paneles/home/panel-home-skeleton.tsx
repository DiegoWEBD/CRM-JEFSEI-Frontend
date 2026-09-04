import { Skeleton } from '@/components/skeleton'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'

export function PanelHomeSkeleton() {
	return (
		<PanelLayout>
			<PanelHeader>
				<div className='flex flex-col gap-1'>
					<Skeleton className='h-7 w-56' />
					<Skeleton className='h-4 w-72' />
				</div>

				<div className='grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 xl:grid-cols-6'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center gap-2.5 rounded-md border border-border/50 bg-card px-3 py-2'
						>
							<div className='size-6 shrink-0 animate-pulse rounded bg-muted' />
							<div className='flex-1 space-y-1'>
								<div className='h-2.5 w-16 animate-pulse rounded bg-muted' />
								<div className='h-5 w-10 animate-pulse rounded bg-muted' />
							</div>
						</div>
					))}
				</div>

				<div className='rounded-lg border border-border bg-card shadow-none'>
					<div className='border-b border-border px-3 py-2 sm:px-4'>
						<Skeleton className='h-5 w-24' />
					</div>
					<div className='space-y-2 p-3 sm:p-4'>
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className='flex items-center gap-3 rounded-md border border-border/60 px-3 py-2.5'>
								<Skeleton className='size-2 rounded-full' />
								<Skeleton className='size-4 rounded' />
								<div className='flex-1 space-y-1'>
									<Skeleton className='h-3.5 w-40' />
									<Skeleton className='h-3 w-56' />
								</div>
								<Skeleton className='h-5 w-8 rounded-md' />
							</div>
						))}
					</div>
				</div>
			</PanelHeader>

			<div className='rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border px-3 py-2 sm:px-4'>
					<Skeleton className='h-5 w-44' />
				</div>
				<div className='grid p-3 sm:p-4 lg:grid-cols-[1fr_auto] lg:gap-6'>
					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-1'>
								<Skeleton className='h-6 w-6 rounded-md' />
								<Skeleton className='h-6 w-28' />
								<Skeleton className='h-6 w-20' />
								<Skeleton className='h-6 w-6 rounded-md' />
							</div>
							<Skeleton className='h-3 w-28' />
						</div>
						<Skeleton className='h-52 w-full rounded-md' />
						<Skeleton className='h-3 w-36' />
					</div>
					<div className='mt-3 space-y-2 lg:mt-0 lg:pl-6 lg:pt-0'>
						<div className='flex items-center justify-between'>
							<Skeleton className='h-3.5 w-44' />
							<Skeleton className='h-5 w-8 rounded-md' />
						</div>
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className='rounded-md border border-border/80 px-3 py-2'>
								<div className='flex items-center justify-between'>
									<Skeleton className='h-3.5 w-32' />
									<Skeleton className='h-4 w-10 rounded' />
								</div>
								<Skeleton className='mt-1 h-3 w-48' />
							</div>
						))}
					</div>
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
