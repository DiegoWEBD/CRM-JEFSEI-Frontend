import { ReactNode } from 'react'

type PanelBodyProps = {
	children: ReactNode
}

const PanelBody = ({ children }: PanelBodyProps) => {
	return (
		<div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_30%]'>
			{children}
		</div>
	)
}

export default PanelBody
