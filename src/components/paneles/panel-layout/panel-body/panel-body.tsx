import { ReactNode } from 'react'

type PanelBodyProps = {
	children: ReactNode
}

const PanelBody = ({ children }: PanelBodyProps) => {
	return <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>{children}</div>
}

export default PanelBody
