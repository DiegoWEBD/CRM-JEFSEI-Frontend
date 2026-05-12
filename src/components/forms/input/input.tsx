import Label from '../label/label'

type InputProps = {
	name?: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
	value?: string | number | null
	type?: string
	label?: string
	placeholder?: string
	className?: string
	error?: string
}

const Input = ({ label, className, error, value, ...props }: InputProps) => {
	return (
		<div className='flex flex-col gap-1'>
			{label ? <Label>{label}</Label> : null}

			<input
				value={value ?? ''}
				className={`
					border rounded-[0.3rem] py-1 px-3
					${error ? 'border-error' : 'border-border-primary'}
					${className ?? ''}
				`}
				{...props}
			/>

			{error ? <p className='text-error text-sm'>{error}</p> : null}
		</div>
	)
}

export default Input
