import { ReactNode } from 'react'

type PanelLayoutProps = {
	children: ReactNode
}

const PanelLayout = ({ children }: PanelLayoutProps) => {
	return <div className='mx-auto grid max-w-7xl gap-4'>{children}</div>
}

export default PanelLayout
