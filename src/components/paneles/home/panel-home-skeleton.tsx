import { Skeleton } from '@/components/skeleton'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'

export function PanelHomeSkeleton() {
	return (
		<PanelLayout>
			{/* Header */}
			<div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
				<div className='flex flex-col gap-1.5'>
					<Skeleton className='h-7 w-40' />
					<Skeleton className='h-4 w-72' />
				</div>
				<div className='flex gap-2'>
					<Skeleton className='h-8 w-28 rounded-md' />
					<Skeleton className='h-8 w-28 rounded-md' />
				</div>
			</div>

			{/* KPI strip — adaptativo */}
			<div className='grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2 sm:gap-3'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className='h-16 rounded-md' />
				))}
			</div>

			{/* Bento grid 3 columnas */}
			<div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
				{/* Alertas — col-span-2 */}
				<div className='rounded-lg border border-border bg-card lg:col-span-2'>
					<div className='border-b border-border px-3 py-2 sm:px-4'>
						<Skeleton className='h-5 w-20' />
					</div>
					<div className='grid p-3 sm:p-4 lg:grid-cols-2 gap-3'>
						<Skeleton className='h-40 rounded-md' />
						<Skeleton className='h-40 rounded-md' />
					</div>
				</div>

				{/* Recordatorios — col-span-1 */}
				<div className='rounded-lg border border-border bg-card lg:col-span-1'>
					<div className='flex items-center justify-between border-b border-border px-3 py-2 sm:px-4'>
						<Skeleton className='h-5 w-28' />
						<Skeleton className='h-8 w-[150px] rounded-md' />
					</div>
					<div className='space-y-2 p-3'>
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className='h-20 rounded-md' />
						))}
					</div>
				</div>

				{/* Avisos de gerencia — col-span-3 ancho completo */}
				<div className='rounded-lg border border-border bg-card lg:col-span-3'>
					<div className='border-b border-border px-3 py-2 sm:px-4'>
						<Skeleton className='h-5 w-36' />
					</div>
					<div className='space-y-2 p-3 sm:p-4'>
						{Array.from({ length: 2 }).map((_, i) => (
							<div key={i} className='rounded-md border border-border/80 px-3 py-2.5'>
								<div className='flex items-start justify-between gap-2'>
									<Skeleton className='h-4 w-48' />
									<Skeleton className='h-5 w-12 rounded-full' />
								</div>
								<Skeleton className='mt-2 h-3 w-full' />
								<div className='mt-2 flex gap-3'>
									<Skeleton className='h-3 w-28' />
									<Skeleton className='h-3 w-24' />
									<Skeleton className='h-3 w-24' />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</PanelLayout>
	)
}