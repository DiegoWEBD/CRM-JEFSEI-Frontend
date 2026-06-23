import { Card, CardContent, CardHeader } from '@/components/card'
import { Skeleton } from '@/components/skeleton'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'

function InfoFieldSkeleton() {
	return (
		<div className='space-y-1'>
			<Skeleton className='h-3 w-20' />
			<Skeleton className='h-5 w-48' />
		</div>
	)
}

export function AdministradorPageSkeleton() {
	return (
		<PanelLayout>
			<PanelHeader>
				<Skeleton className='h-7 w-64' />
			</PanelHeader>

			<Card>
				<CardHeader>
					<Skeleton className='h-5 w-44' />
				</CardHeader>
				<CardContent className='grid gap-4 sm:grid-cols-2'>
					<InfoFieldSkeleton />
					<InfoFieldSkeleton />
					<InfoFieldSkeleton />
					<InfoFieldSkeleton />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<Skeleton className='h-5 w-44' />
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className='flex items-center gap-4'>
								<Skeleton className='h-10 w-10 rounded-md' />
								<div className='flex-1 space-y-1.5'>
									<Skeleton className='h-4 w-3/4' />
									<Skeleton className='h-3 w-1/2' />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</PanelLayout>
	)
}
