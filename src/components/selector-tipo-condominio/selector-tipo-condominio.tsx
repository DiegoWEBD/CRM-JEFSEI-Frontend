import {
	TIPO_CONDOMINIO_LABELS,
	TIPO_CONDOMINIO_OPCIONES,
} from '@/lib/condominio-vertical'
import { Select } from '../select/select'
import { SelectContent } from '../select/select-content'
import { SelectItem } from '../select/select-item'
import { SelectTrigger } from '../select/select-trigger'
import { SelectValue } from '../select/select-value'

type SelectorTipoCondominioProps = {
	name: string
	value?: string
	onChange: (value?: string) => void
}

export default function SelectorTipoCondominio({
	name,
	value,
	onChange,
}: SelectorTipoCondominioProps) {
	return (
		<Select
			name={name}
			value={value || '__none__'}
			onValueChange={value =>
				onChange(value === '__none__' ? undefined : value)
			}
		>
			<SelectTrigger>
				<SelectValue placeholder='Seleccionar tipo' />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='__none__' className='text-xs text-muted-foreground'>
					Seleccionar tipo
				</SelectItem>
				{TIPO_CONDOMINIO_OPCIONES.map(opt => (
					<SelectItem key={opt} value={opt} className='text-xs'>
						{TIPO_CONDOMINIO_LABELS[opt]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
