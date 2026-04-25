type BotonProps = {
	styleType?: 'primary' | 'success' | 'danger'
	children: React.ReactNode
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
}

const styles = {
	primary: 'bg-primary hover:bg-primary-hover',
	success: 'bg-success hover:bg-success-hover',
	danger: 'bg-danger hover:bg-danger-hover',
}

const Boton = ({ styleType = 'primary', children, ...props }: BotonProps) => {
	return (
		<button
			className={`${styles[styleType]} text-white font-bold py-2 px-4 rounded-lg hover:bg-${styleType}-hover transition-all hover:cursor-pointer`}
			{...props}
		>
			{children}
		</button>
	)
}

export default Boton
