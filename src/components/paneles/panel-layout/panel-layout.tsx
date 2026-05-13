import { ReactNode } from 'react'

type PanelLayoutProps = {
	children: ReactNode
}

const PanelLayout = ({ children }: PanelLayoutProps) => {
	return <div className='mx-auto grid gap-6'>{children}</div>
}

export default PanelLayout
