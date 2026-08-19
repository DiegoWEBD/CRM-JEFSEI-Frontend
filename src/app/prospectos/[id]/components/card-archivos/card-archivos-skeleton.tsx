import { Skeleton } from '@/components/skeleton'

export default function CardArchivosSkeleton() {
	return (
		<table className='w-full text-xs'>
			<thead>
				<tr className='border-b border-border text-left'>
					<th className='pb-1.5' colSpan={2}>
						<Skeleton className='h-3 w-16' />
					</th>
					<th className='pb-1.5'>
						<Skeleton className='h-3 w-12' />
					</th>
					<th className='pb-1.5'>
						<Skeleton className='h-3 w-14' />
					</th>
					<th className='pb-1.5' />
				</tr>
			</thead>
			<tbody>
				{Array.from({ length: 3 }).map((_, i) => (
					<tr
						key={i}
						className='border-b border-border/40 last:border-0'
					>
						<td className='py-1.5 pr-1'>
							<Skeleton className='h-4 w-4 rounded' />
						</td>
						<td className='py-1.5'>
							<Skeleton className='h-3 w-32' />
						</td>
						<td className='py-1.5'>
							<Skeleton className='h-3 w-12' />
						</td>
						<td className='py-1.5'>
							<Skeleton className='h-3 w-20' />
						</td>
						<td className='py-1.5'>
							<div className='flex justify-end gap-1'>
								<Skeleton className='h-7 w-7 rounded-md' />
								<Skeleton className='h-7 w-7 rounded-md' />
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
