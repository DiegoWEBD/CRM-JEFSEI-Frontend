import Card from '@/components/card/card'
import { ReactNode } from 'react'

type IteminformacionProps = {
	title: string
	info: string
	icon: ReactNode
}

const Iteminformacion = ({ title, info, icon }: IteminformacionProps) => {
	return (
		<Card className='shadow-none flex gap-3 items-center w-full'>
			<div className='bg-primary-highlight-light text-primary-highlight text-lg h-10 w-10 items-center justify-center flex rounded-full'>
				{icon}
			</div>
			<div>
				<p className='text-subtitle text-sm'>{title}</p>
				<p className='font-semibold text-sm'>{info}</p>
			</div>
		</Card>
	)
}

export default Iteminformacion
