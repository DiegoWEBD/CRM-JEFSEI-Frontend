import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import { FiUser } from 'react-icons/fi'

const InformacionProspectoSkeleton = () => {
	return (
		<Card>
			<CardHeader title='Información del Prospecto' icon={<FiUser />} primary />

			<div className='flex flex-col gap-4 xl:flex-row animate-pulse'>
				{/* Item 1 */}
				<div className='flex-1 border border-border-primary rounded-xl p-4'>
					<div className='flex items-center gap-3 mb-4'>
						<div className='h-5 w-5 rounded bg-skeleton' />
						<div className='h-4 w-24 rounded bg-skeleton' />
					</div>

					<div className='h-5 w-40 rounded bg-skeleton' />
				</div>

				{/* Item 2 */}
				<div className='flex-1 border border-border-primary rounded-xl p-4'>
					<div className='flex items-center gap-3 mb-4'>
						<div className='h-5 w-5 rounded bg-skeleton' />
						<div className='h-4 w-20 rounded bg-skeleton' />
					</div>

					<div className='h-5 w-56 rounded bg-skeleton' />
				</div>
			</div>
		</Card>
	)
}

export default InformacionProspectoSkeleton
