import { Skeleton } from '@/components/skeleton'

export function SkeletonPanelPolizas() {
	return (
		<div className='space-y-6'>
			{/* Header skeleton */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div className='space-y-1'>
					<Skeleton className='h-3 w-24' />
					<div className='flex items-center gap-2.5'>
						<Skeleton className='h-9 w-9 rounded-lg' />
						<div className='space-y-1'>
							<Skeleton className='h-5 w-20' />
							<Skeleton className='h-3 w-40' />
						</div>
					</div>
				</div>
				<Skeleton className='h-9 w-28 rounded-lg' />
			</div>

			{/* KPIs skeleton - estados */}
			<div className='grid grid-cols-3 gap-2 sm:grid-cols-6'>
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className='relative rounded-lg border border-border/70 bg-card px-3 py-2.5'
					>
						<div className='absolute left-0 top-2 bottom-2 w-1 rounded-full bg-muted' />
						<div className='pl-1 space-y-1.5'>
							<Skeleton className='h-3 w-16' />
							<Skeleton className='h-6 w-8' />
						</div>
					</div>
				))}
			</div>

			{/* KPIs skeleton - financieros */}
			<div className='grid grid-cols-3 gap-2'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-3 rounded-lg border border-border/70 bg-card px-4 py-3'
					>
						<Skeleton className='h-8 w-8 rounded-md' />
						<div className='space-y-1'>
							<Skeleton className='h-3 w-20' />
							<Skeleton className='h-4 w-16' />
						</div>
					</div>
				))}
			</div>

			{/* Filtros skeleton */}
			<div className='rounded-lg border border-border/70 bg-card p-3'>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
					<div className='sm:col-span-2 lg:col-span-1'>
						<Skeleton className='mb-1 h-3 w-14' />
						<Skeleton className='h-8 w-full' />
					</div>
					<div>
						<Skeleton className='mb-1 h-3 w-16' />
						<Skeleton className='h-8 w-full' />
					</div>
					<div>
						<Skeleton className='mb-1 h-3 w-24' />
						<Skeleton className='h-8 w-full' />
					</div>
				</div>
				<div className='mt-2 flex items-center justify-between'>
					<div />
					<Skeleton className='h-3 w-20' />
				</div>
			</div>

			{/* Tabla skeleton - mobile */}
			<div className='space-y-2 lg:hidden'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className='relative rounded-lg border border-border/70 bg-card px-4 py-3 pl-4'
					>
						<div className='absolute left-0 top-3 bottom-3 w-1 rounded-full bg-muted' />
						<div className='flex items-start justify-between gap-2'>
							<div className='space-y-1'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-3 w-32' />
							</div>
							<Skeleton className='h-5 w-16 rounded-full' />
						</div>
						<div className='mt-2 grid grid-cols-2 gap-x-4 gap-y-1'>
							<Skeleton className='h-3 w-20' />
							<Skeleton className='h-3 w-24' />
							<Skeleton className='h-3 w-16' />
							<Skeleton className='h-3 w-20' />
						</div>
					</div>
				))}
			</div>

			{/* Tabla skeleton - desktop */}
			<div className='hidden lg:block'>
				<div className='overflow-x-auto rounded-lg border border-border/70'>
					<table className='w-full'>
						<thead>
							<tr className='border-b border-border bg-muted/50'>
								{['N° Póliza', 'Cliente', 'Producto', 'Compañía', 'Prima Neta', 'Estado', 'Vigencia'].map(
									h => (
										<th key={h} className='h-8 px-3'>
											<Skeleton className='h-3 w-16' />
										</th>
									),
								)}
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 5 }).map((_, i) => (
								<tr
									key={i}
									className='border-b border-border/40 last:border-b-0'
								>
									<td className='px-3 py-2'>
										<Skeleton className='h-4 w-24' />
									</td>
									<td className='px-3 py-2'>
										<Skeleton className='h-3 w-32' />
									</td>
									<td className='px-3 py-2'>
										<Skeleton className='h-3 w-20' />
									</td>
									<td className='px-3 py-2'>
										<Skeleton className='h-3 w-20' />
									</td>
									<td className='px-3 py-2'>
										<Skeleton className='h-3 w-16 ml-auto' />
									</td>
									<td className='px-3 py-2'>
										<Skeleton className='h-5 w-16 mx-auto rounded-full' />
									</td>
									<td className='px-3 py-2'>
										<Skeleton className='h-3 w-28' />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
