import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import Campo from '@/components/forms/campo/campo'
import SiNoSelect from '@/components/forms/si-no-select/si-no-select'
import { Input } from '@/components/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import {
	UBICACION_PISCINA_LABELS,
	UBICACION_PISCINA_OPCIONES_CON_PISCINA,
	UbicacionPiscinaCondominio,
} from '@/lib/ubicacion.piscina'
import { cn } from '@/lib/utils'
import { FormikProps } from 'formik'

type Props = {
	formik: FormikProps<FormularioInitialValues>
}

export default function SeccionEvaluacion({ formik }: Props) {
	return (
		<>
			<Campo label='Total m² construidos'>
				<Input
					name='metros_cuadrados'
					value={formik.values.metros_cuadrados ?? ''}
					onChange={formik.handleChange}
					inputMode='decimal'
				/>
			</Campo>

			<Campo label='% espacios comunes'>
				<Input
					name='porcentaje_espacios_comunes'
					value={formik.values.porcentaje_espacios_comunes ?? ''}
					onChange={formik.handleChange}
					inputMode='decimal'
				/>
			</Campo>

			<Campo label='Número de pisos'>
				<Input
					name='numero_pisos'
					value={formik.values.numero_pisos ?? ''}
					onChange={formik.handleChange}
					inputMode='numeric'
				/>
			</Campo>

			<Campo label='Número de torres'>
				<Input
					name='numero_torres'
					value={formik.values.numero_torres ?? ''}
					onChange={formik.handleChange}
					inputMode='numeric'
				/>
			</Campo>

			<Campo label='Cantidad de departamentos'>
				<Input
					name='cantidad_departamentos'
					value={formik.values.cantidad_departamentos ?? ''}
					onChange={formik.handleChange}
					inputMode='numeric'
				/>
			</Campo>

			<Campo label='Cantidad de subterráneos'>
				<Input
					name='cantidad_subterraneos'
					value={formik.values.cantidad_subterraneos ?? ''}
					onChange={formik.handleChange}
					inputMode='numeric'
				/>
			</Campo>

			<SiNoSelect
				label='Cuenta con piscina'
				value={formik.values.tiene_piscina}
				onChange={value => formik.setFieldValue('tiene_piscina', value)}
			/>

			<Campo label='Ubicación de la piscina'>
				<Select
					disabled={
						formik.values.tiene_piscina === undefined ||
						formik.values.tiene_piscina === null ||
						!formik.values.tiene_piscina
					}
					value={
						!formik.values.tiene_piscina
							? 'no_aplica'
							: formik.values.ubicacion_piscina || '__none__'
					}
					onValueChange={value => {
						const v =
							value === '__none__'
								? undefined
								: (value as UbicacionPiscinaCondominio)
						formik.setFieldValue('ubicacion_piscina', v)
					}}
				>
					<SelectTrigger
						className={cn('h-9 text-sm shadow-none', {
							'cursor-not-allowed opacity-70': !formik.values.tiene_piscina,
						})}
					>
						<SelectValue placeholder='Seleccione' />
					</SelectTrigger>
					<SelectContent>
						{formik.values.tiene_piscina ? (
							<>
								<SelectItem
									value='__none__'
									className='text-xs text-muted-foreground'
								>
									Seleccione
								</SelectItem>
								{UBICACION_PISCINA_OPCIONES_CON_PISCINA.map(k => (
									<SelectItem key={k} value={k} className='text-xs'>
										{UBICACION_PISCINA_LABELS[k]}
									</SelectItem>
								))}
							</>
						) : (
							<SelectItem value='no_aplica' className='text-xs'>
								{UBICACION_PISCINA_LABELS.no_aplica}
							</SelectItem>
						)}
					</SelectContent>
				</Select>
			</Campo>
		</>
	)
}
