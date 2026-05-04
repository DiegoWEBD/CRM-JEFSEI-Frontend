type ButtonProps = {
	styleType?: 'primary' | 'success' | 'danger'
	children: React.ReactNode
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
}

const styles = {
	primary: 'bg-primary-highlight hover:bg-primary-highlight-hover',
	success: 'bg-success hover:bg-success-hover',
	danger: 'bg-danger hover:bg-danger-hover',
}

const Button = ({ styleType = 'primary', children, ...props }: ButtonProps) => {
	return (
		<button
			className={`${styles[styleType]} text-white font-bold py-2 px-4 rounded-lg hover:bg-${styleType}-hover transition-all hover:cursor-pointer`}
			{...props}
		>
			{children}
		</button>
	)
}

export default Button
