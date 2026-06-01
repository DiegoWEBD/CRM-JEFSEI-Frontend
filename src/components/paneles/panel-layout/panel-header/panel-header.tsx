import { ReactNode } from 'react'

type PanelHeaderProps = {
	children: ReactNode
}

const PanelHeader = ({ children }: PanelHeaderProps) => {
	return <div className='space-y-6'>{children}</div>
}

export default PanelHeader
