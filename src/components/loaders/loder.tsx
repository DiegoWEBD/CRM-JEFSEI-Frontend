type LoaderProps = {
	text?: string
	fullScreen?: boolean
	size?: 'sm' | 'md' | 'lg'
}

const Loader = ({
	text = 'Cargando...',
	fullScreen = false,
	size = 'md',
}: LoaderProps) => {
	const sizeClasses = {
		sm: 'w-5 h-5 border-2',
		md: 'w-8 h-8 border-4',
		lg: 'w-12 h-12 border-4',
	}

	const content = (
		<div className='flex flex-col items-center justify-center gap-3'>
			<div
				className={`
					animate-spin
					rounded-full
					border-gray-300
					border-t-black
					${sizeClasses[size]}
				`}
			/>
			{text && <p className='text-sm font-medium text-gray-700'>{text}</p>}
		</div>
	)

	if (fullScreen) {
		return (
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm'>
				{content}
			</div>
		)
	}

	return content
}

export default Loader
