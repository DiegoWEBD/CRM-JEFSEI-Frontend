import Label from '../label/label'

type InputProps = {
	name?: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	value?: string | number
	type?: string
	label?: string
	placeholder?: string
	className?: string
}

const Input = ({ label, className, ...props }: InputProps) => {
	return (
		<div className='flex flex-col gap-1'>
			{label ? <Label>{label}</Label> : null}
			<input
				className={`border rounded-[0.3rem] border-gray-300 py-1 px-3 ${className}`}
				{...props}
			/>
		</div>
	)
}

export default Input
