type MainContentLayoutProps = {
	children?: React.ReactNode
	className?: string
}

const MainContentLayout = ({
	children,
	className = '',
}: MainContentLayoutProps) => {
	return (
		<main className={`flex-1 p-4 overflow-auto ${className}`}>{children}</main>
	)
}

export default MainContentLayout
