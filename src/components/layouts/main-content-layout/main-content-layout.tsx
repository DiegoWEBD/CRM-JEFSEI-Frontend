type MainContentLayoutProps = {
	children?: React.ReactNode
	className?: string
	bare?: boolean
}

const MainContentLayout = ({
	children,
	className = '',
	bare = false,
}: MainContentLayoutProps) => {
	if (bare) {
		return (
			<main className={`flex-1 overflow-auto ${className}`}>{children}</main>
		)
	}

	return (
		<main className={`flex-1 overflow-auto ${className}`}>
			<div className='mx-auto w-full max-w-[1600px] p-3 lg:p-8'>{children}</div>
		</main>
	)
}

export default MainContentLayout
