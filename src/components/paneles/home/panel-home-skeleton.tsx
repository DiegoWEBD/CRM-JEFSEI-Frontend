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

			{/* KPI strip */}
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className='h-16 rounded-md' />
				))}
			</div>

			{/* PanelBody 70/30 */}
			<div className='grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_30%]'>
				{/* Main column */}
				<div className='min-w-0 space-y-6'>
					{/* Alertas */}
					<div className='rounded-lg border border-border bg-card'>
						<div className='border-b border-border px-3 py-2 sm:px-4'>
							<Skeleton className='h-5 w-20' />
						</div>
						<div className='grid p-3 sm:p-4 lg:grid-cols-2 gap-3'>
							<Skeleton className='h-48 rounded-md' />
							<Skeleton className='h-48 rounded-md' />
						</div>
					</div>
					{/* Avisos de gerencia */}
					<div className='rounded-lg border border-border bg-card'>
						<div className='border-b border-border px-3 py-2 sm:px-4'>
							<Skeleton className='h-5 w-36' />
						</div>
						<div className='space-y-1.5 p-3 sm:p-4'>
							{Array.from({ length: 2 }).map((_, i) => (
								<Skeleton key={i} className='h-12 rounded-md' />
							))}
						</div>
					</div>
					{/* Pendientes */}
					<div className='rounded-lg border border-border bg-card'>
						<div className='border-b border-border px-3 py-2 sm:px-4'>
							<Skeleton className='h-5 w-36' />
						</div>
						<div className='space-y-2 p-3 sm:p-4'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className='flex items-center gap-3'>
									<Skeleton className='h-4 flex-1' />
									<Skeleton className='h-5 w-24 rounded-full' />
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className='min-h-45 space-y-6'>
					{/* Recordatorios */}
					<div className='rounded-lg border border-border bg-card'>
						<div className='border-b border-border px-3 py-2 sm:px-4'>
							<Skeleton className='h-5 w-28' />
						</div>
						<div className='space-y-2 p-3'>
							{Array.from({ length: 2 }).map((_, i) => (
								<Skeleton key={i} className='h-16 rounded-md' />
							))}
						</div>
					</div>
					{/* Calendario */}
					<div className='rounded-lg border border-border bg-card'>
						<div className='border-b border-border px-3 py-2 sm:px-4'>
							<Skeleton className='h-5 w-24' />
						</div>
						<div className='p-3'>
							<Skeleton className='h-56 rounded-md' />
						</div>
					</div>
				</div>
			</div>
		</PanelLayout>
	)
}
