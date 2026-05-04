import { ReactNode } from 'react'

type PanelHeaderProps = {
	children: ReactNode
}

const PanelHeader = ({ children }: PanelHeaderProps) => {
	return <div>{children}</div>
}

export default PanelHeader
