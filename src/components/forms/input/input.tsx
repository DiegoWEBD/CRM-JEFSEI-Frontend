import Label from '../label/label'

type InputProps = {
	name: string
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	value: string
	type?: string
	label?: string
}

const Input = ({ label, ...props }: InputProps) => {
	return (
		<div className='flex flex-col gap-1'>
			{label ? <Label>{label}</Label> : null}
			<input
				className='border rounded-[0.3rem] border-gray-300 py-1 px-3'
				{...props}
			/>
		</div>
	)
}

export default Input
