import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Skeleton } from '@/components/skeleton'

export default function InformacionProspectoSkeleton() {
	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle primary>Información general del prospecto</CardTitle>
			</CardHeader>
			<CardContent className='p-4'>
				<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{Array.from({ length: 11 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5'
						>
							<Skeleton className='h-9 w-9 shrink-0 rounded-md' />
							<div className='min-w-0 flex-1 space-y-1'>
								<Skeleton className='h-3 w-16' />
								<Skeleton className='h-4 w-full' />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
