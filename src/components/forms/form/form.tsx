type FormProps = {
	onSubmit: () => void
	children: React.ReactNode
	className?: string
}

const Form = ({ children, className, ...props }: FormProps) => {
	return (
		<form {...props} className={`flex flex-col gap-4 ${className}`}>
			{children}
		</form>
	)
}

export default Form
