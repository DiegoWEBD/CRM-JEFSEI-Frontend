import { ReactNode } from 'react'

type PanelBodyProps = {
	children: ReactNode
}

const PanelBody = ({ children }: PanelBodyProps) => {
	return (
		<div className='grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]'>
			{children}
		</div>
	)
}

export default PanelBody
