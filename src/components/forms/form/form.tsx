type FormProps = {
	onSubmit: () => void
	children: React.ReactNode
	className?: string
}

const Form = ({ children, className, ...props }: FormProps) => {
	return (
		<form
			{...props}
			className={`bg-white p-5 rounded-xl w-full sm:w-md shadow-lg ${className}`}
		>
			{children}
		</form>
	)
}

export default Form
