import { PanelKpiSkeleton } from '@/components/paneles/shared/panel-kpi-card/panel-kpi-card'
import { Skeleton } from '@/components/skeleton'

export function SkeletonPanelPolizas() {
	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<Skeleton className='h-7 w-32' />
				<Skeleton className='h-4 w-48' />
			</div>

			<PanelKpiSkeleton count={5} />

			<div className='flex flex-wrap items-center gap-3'>
				<Skeleton className='h-9 w-64' />
				<Skeleton className='h-9 w-40' />
				<Skeleton className='h-9 w-40' />
				<Skeleton className='h-9 w-40' />
			</div>

			<div className='space-y-3 lg:hidden'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className='rounded-lg border border-border bg-card p-4'>
						<div className='flex items-start justify-between gap-2'>
							<div className='space-y-1.5'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-3 w-24' />
							</div>
							<Skeleton className='h-5 w-16 rounded-full' />
						</div>
						<div className='mt-2 grid grid-cols-2 gap-x-3 gap-y-1'>
							<Skeleton className='h-3 w-20' />
							<Skeleton className='h-3 w-24' />
							<Skeleton className='h-3 w-16' />
							<Skeleton className='h-3 w-20' />
						</div>
					</div>
				))}
			</div>

			<div className='hidden lg:block'>
				<div className='overflow-x-auto rounded-lg border border-border'>
					<table className='w-full'>
						<thead>
							<tr className='border-b border-border bg-muted/40'>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-20' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-24' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-20' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-20' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-12' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-16 ml-auto' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-16 mx-auto' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-24' /></th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 5 }).map((_, i) => (
								<tr key={i} className='border-b border-border/50 last:border-b-0'>
									<td className='px-4 py-2.5'><Skeleton className='h-4 w-24' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-3 w-32' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-3 w-20' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-3 w-20' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-3 w-12' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-3 w-16 ml-auto' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-5 w-16 mx-auto rounded-full' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-3 w-24' /></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
