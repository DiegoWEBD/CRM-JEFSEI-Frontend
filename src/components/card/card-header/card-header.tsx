import { ReactElement } from 'react'

type CardHeaderProps = {
	title: string
	icon?: ReactElement
	primary?: boolean
}

const CardHeader = ({ title, icon, primary }: CardHeaderProps) => {
	return (
		<div
			className={`flex gap-3 items-center ${primary ? 'mb-7' : 'justify-between flex-row-reverse'}`}
		>
			{icon ? (
				<div className='text-primary-highlight text-xl'>{icon}</div>
			) : null}
			<p className={primary ? 'text-xl font-semibold' : 'text-subtitle'}>
				{title}
			</p>
		</div>
	)
}

export default CardHeader
