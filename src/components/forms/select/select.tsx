import Label from '../label/label'

type Option = {
	value: string | number
	label: string
}

type SelectProps = {
	name?: string
	value?: string | number
	label?: string
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
	onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void
	onFocus?: () => void
	className?: string
	error?: string
	options: Option[]
	placeholder?: string
	disabled?: boolean
}

const Select = ({
	label,
	className,
	error,
	value,
	options,
	placeholder,
	...props
}: SelectProps) => {
	return (
		<div className='flex flex-col gap-1'>
			{label ? <Label>{label}</Label> : null}

			<select
				value={value ?? ''}
				className={`
					border rounded-[0.3rem] py-1 px-3 bg-white
					${error ? 'border-error' : 'border-border-primary'}
					${className ?? ''}
				`}
				{...props}
			>
				<option value=''>{placeholder ?? 'Selecciona una opción'}</option>

				{options.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			{error ? <p className='text-error text-sm'>{error}</p> : null}
		</div>
	)
}

export default Select
