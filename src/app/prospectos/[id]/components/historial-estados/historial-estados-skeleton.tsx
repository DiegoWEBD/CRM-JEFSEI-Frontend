import { Card, CardHeader } from '@/components/card'

type HistorialEstadosSkeletonProps = {
	cantidad?: number
}

const HistorialEstadosSkeleton = ({
	cantidad = 4,
}: HistorialEstadosSkeletonProps) => {
	return (
		<Card>
			<CardHeader title='Historial de Acciones' />

			<div className='space-y-8 animate-pulse'>
				{Array.from({ length: cantidad }).map((_, index) => (
					<div key={`historial-skeleton-${index}`} className='flex gap-4'>
						{/* Línea + círculo timeline */}
						<div className='flex flex-col items-center'>
							<div className='h-4 w-4 rounded-full bg-skeleton' />

							{index !== cantidad - 1 && (
								<div className='w-px flex-1 min-h-20 bg-skeleton mt-2' />
							)}
						</div>

						{/* Contenido */}
						<div className='flex-1 pb-2'>
							<div className='flex items-center justify-between gap-4'>
								<div className='h-5 w-40 rounded bg-skeleton' />
								<div className='h-4 w-24 rounded bg-skeleton' />
							</div>

							<div className='mt-3 h-4 w-2/3 rounded bg-skeleton' />

							<div className='mt-2 h-4 w-1/3 rounded bg-skeleton' />
						</div>
					</div>
				))}
			</div>
		</Card>
	)
}

export default HistorialEstadosSkeleton
