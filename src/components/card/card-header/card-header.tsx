import { ReactElement } from 'react'

type CardHeaderProps = {
	title: string
	icon?: ReactElement
}

const CardHeader = ({ title, icon }: CardHeaderProps) => {
	return (
		<div className='flex justify-between items-start'>
			<p className='text-subtitle'>{title}</p>

			<div className='text-primary-highlight text-lg'>{icon}</div>
		</div>
	)
}

export default CardHeader
