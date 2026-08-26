import { Card } from '@/components/card'
import { Skeleton } from '@/components/skeleton'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import ProspectoHeroHeaderSkeleton from './prospecto-hero-header/prospecto-hero-header-skeleton'

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
			<ProspectoHeroHeaderSkeleton />

			{/* Sticky nav skeleton */}
			<div className='flex gap-2 border-b border-border py-2'>
				{['General', 'Contactos', 'Comercial', 'Pólizas', 'Seguimiento'].map(
					label => (
						<Skeleton key={label} className='h-8 w-20 rounded-md' />
					),
				)}
			</div>

			{/* Sección General */}
			<section className='space-y-4'>
				<CardSkeleton>
					<Skeleton className='h-5 w-40' />
					<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className='flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5'
							>
								<Skeleton className='h-9 w-9 shrink-0 rounded-md' />
								<div className='space-y-1'>
									<Skeleton className='h-3 w-16' />
									<Skeleton className='h-4 w-24' />
								</div>
							</div>
						))}
					</div>
				</CardSkeleton>

				<CardSkeleton>
					<Skeleton className='h-5 w-56' />
					<div className='grid grid-cols-3 gap-4'>
						{Array.from({ length: 9 }).map((_, i) => (
							<div key={i} className='space-y-1.5'>
								<Skeleton className='h-3 w-20' />
								<Skeleton className='h-4 w-full' />
							</div>
						))}
					</div>
				</CardSkeleton>
			</section>

			{/* Sección Contactos */}
			<section>
				<div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
					<div className='lg:col-span-2'>
						<CardSkeleton>
							<Skeleton className='h-5 w-40' />
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
						</CardSkeleton>
					</div>
					<CardSkeleton>
						<Skeleton className='h-5 w-24' />
						<div className='space-y-2'>
							{Array.from({ length: 2 }).map((_, i) => (
								<Skeleton key={i} className='h-8 w-full' />
							))}
						</div>
					</CardSkeleton>
				</div>
			</section>

			{/* Sección Comercial */}
			<CardSkeleton>
				<Skeleton className='h-5 w-48' />
				<div className='space-y-2'>
					{Array.from({ length: 2 }).map((_, i) => (
						<Skeleton key={i} className='h-12 w-full rounded-lg' />
					))}
				</div>
			</CardSkeleton>

			{/* Sección Pólizas */}
			<CardSkeleton>
				<Skeleton className='h-5 w-36' />
				<div className='grid grid-cols-3 gap-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center gap-3 rounded-md border border-border/60 px-3 py-2.5'
						>
							<Skeleton className='h-9 w-9 shrink-0 rounded-md' />
							<div className='space-y-1'>
								<Skeleton className='h-3 w-16' />
								<Skeleton className='h-5 w-12' />
							</div>
						</div>
					))}
				</div>
			</CardSkeleton>
		</PanelLayout>
	)
}
