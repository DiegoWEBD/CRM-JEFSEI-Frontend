import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import { TbUsers } from 'react-icons/tb'

type CardProspectosSkeletonProps = {
	cantidad?: number
}

const CardProspectosSkeleton = ({ cantidad = 6 }: CardProspectosSkeletonProps) => {
	return (
		<Card>
			<CardHeader title='Prospectos' icon={<TbUsers />} primary />
			<div className='flex flex-col'>
				{Array.from({ length: cantidad }).map((_, index) => (
					<div
						key={`prospecto-skeleton-${index}`}
						className='border-t border-border-primary py-3 animate-pulse'
					>
						<div className='flex justify-between items-center'>
							<div className='h-4 w-2/5 rounded bg-gray-200' />
							<div className='h-6 w-20 rounded-full bg-gray-200' />
						</div>
						<div className='mt-2 h-3 w-1/3 rounded bg-gray-200' />
						<div className='mt-4 h-3 w-1/4 rounded bg-gray-200' />
						<div className='mt-2 h-3 w-1/5 rounded bg-gray-200' />
					</div>
				))}
			</div>
		</Card>
	)
}

export default CardProspectosSkeleton
