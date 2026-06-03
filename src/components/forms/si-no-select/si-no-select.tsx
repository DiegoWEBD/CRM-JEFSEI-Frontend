import Campo from '../campo/campo'
import Select from '../select/select'
import SelectContent from '../select/select-content/select-content'
import SelectItem from '../select/select-item/select-item'
import SelectTrigger from '../select/select-trigger/select-trigger'
import SelectValue from '../select/select-value/select-value'

export type SiNo = '' | 'si' | 'no'

type SiNoSelectProps = {
	label: string
	value?: boolean | null
	onChange: (value: boolean | undefined) => void
}

export default function SiNoSelect({
	label,
	value,
	onChange,
}: SiNoSelectProps) {
	return (
		<Campo label={label}>
			<Select
				value={
					value === undefined || value === null
						? '__none__'
						: value
							? 'si'
							: 'no'
				}
				onValueChange={v => {
					if (v === '__none__') onChange(undefined)
					else onChange(v === 'si')
				}}
			>
				<SelectTrigger className='h-9 text-sm shadow-none'>
					<SelectValue placeholder='Seleccionar' />
				</SelectTrigger>

				<SelectContent>
					<SelectItem value='__none__'>Seleccionar</SelectItem>

					<SelectItem value='si'>Sí</SelectItem>

					<SelectItem value='no'>No</SelectItem>
				</SelectContent>
			</Select>
		</Campo>
	)
}
