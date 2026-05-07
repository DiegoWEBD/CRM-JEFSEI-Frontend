import { ReactNode } from 'react'

type PanelBodySidebarProps = {
	children: ReactNode
}

const PanelBodySidebar = ({ children }: PanelBodySidebarProps) => {
	return <div className='min-h-45 space-y-6'>{children}</div>
}

export default PanelBodySidebar
