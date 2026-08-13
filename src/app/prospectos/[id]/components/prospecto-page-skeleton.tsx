import { Card } from '@/components/card'
import { Skeleton } from '@/components/skeleton'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import PaginaProspectoHeaderSkeleton from './pagina-prospecto-header/pagina-prospecto-header-skeleton'
import InformacionProspectoSkeleton from './card-informacion-prospecto/informacion-prospecto-skeleton'
import CardContactosSkeleton from './card-contactos/card-contactos-skeleton'

function CardSkeleton({ children }: { children: React.ReactNode }) {
	return (
		<Card className='space-y-4 p-4'>
			{children}
		</Card>
	)
}

export function ProspectoPageSkeleton() {
	return (
		<PanelLayout>
			<PanelHeader>
				<PaginaProspectoHeaderSkeleton />
			</PanelHeader>

			<InformacionProspectoSkeleton />

			<CardContactosSkeleton />

			<CardSkeleton>
				<Skeleton className='h-5 w-48' />
				<div className='space-y-3'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className='flex items-center gap-4'>
							<Skeleton className='h-10 w-10 rounded-md' />
							<div className='flex-1 space-y-1.5'>
								<Skeleton className='h-4 w-3/4' />
								<Skeleton className='h-3 w-1/2' />
							</div>
							<Skeleton className='h-8 w-24 rounded-md' />
						</div>
					))}
				</div>
			</CardSkeleton>

			<CardSkeleton>
				<Skeleton className='h-5 w-32' />
				<div className='space-y-2'>
					{Array.from({ length: 2 }).map((_, i) => (
						<Card key={i} className='p-3'>
							<div className='flex items-center justify-between'>
								<Skeleton className='h-4 w-40' />
								<Skeleton className='h-4 w-28' />
							</div>
						</Card>
					))}
				</div>
			</CardSkeleton>
		</PanelLayout>
	)
}
