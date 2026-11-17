import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type PanelLayoutProps = {
	children: ReactNode
	className?: string
}

const PanelLayout = ({ children, className }: PanelLayoutProps) => {
	return <div className={cn('mx-auto grid gap-8', className)}>{children}</div>
}

export default PanelLayout
