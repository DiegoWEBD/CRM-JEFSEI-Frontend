import { ReactNode } from 'react'

type PanelBodyMainContentProps = {
	children: ReactNode
}

const PanelBodyMainContent = ({ children }: PanelBodyMainContentProps) => {
	return <div className='min-h-87.5 min-w-0 space-y-6'>{children}</div>
}

export default PanelBodyMainContent
