import { ReactNode } from 'react'

type PanelLayoutProps = {
	children: ReactNode
}

const PanelLayout = ({ children }: PanelLayoutProps) => {
	return <div className='grid grid-cols-1 gap-6'>{children}</div>
}

export default PanelLayout
