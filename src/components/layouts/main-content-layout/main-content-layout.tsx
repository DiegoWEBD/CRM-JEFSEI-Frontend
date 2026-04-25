type MainContentLayoutProps = {
	children: React.ReactNode
	className?: string
}

const MainContentLayout = ({
	children,
	className = '',
}: MainContentLayoutProps) => {
	return (
		<main
			className={`min-h-screen w-screen flex items-center justify-center ${className}`}
		>
			{children}
		</main>
	)
}

export default MainContentLayout
