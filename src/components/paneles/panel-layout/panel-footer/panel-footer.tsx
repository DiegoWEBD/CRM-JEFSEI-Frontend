import { ReactNode } from 'react'

type PanelFooterProps = {
	children: ReactNode
}

const PanelFooter = ({ children }: PanelFooterProps) => {
	return <div className='min-h-50'>{children}</div>
}

export default PanelFooter
