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
	CLASIFICACION_PRELIMINAR_INCENDIO_LABELS,
	clasificacionPreliminarDesdeMaterialidad,
	ClasificacionPreliminarIncendio,
	MATERIALIDAD_PRINCIPAL_LABELS,
	MaterialidadPrincipalCondominio,
} from '@/lib/materialidades'
import { FormikProps } from 'formik'

const USO_CONDOMINIO_OPTIONS = [
	{ value: 'habitacional', label: 'Habitacional' },
	{ value: 'comercial', label: 'Comercial' },
	{ value: 'oficinas', label: 'Oficinas' },
	{ value: 'habitacional_y_comercial', label: 'Habitacional y comercial' },
]

type Props = {
	formik: FormikProps<FormularioInitialValues>
}

export default function SeccionConstruccion({ formik }: Props) {
	return (
		<>
			<Campo label='Uso del condominio'>
				<Select
					value={formik.values.uso_del_condominio || '__none__'}
					onValueChange={value =>
						formik.setFieldValue(
							'uso_del_condominio',
							value === '__none__' ? '' : value,
						)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder='Seleccionar uso' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem
							value='__none__'
							className='text-xs text-muted-foreground'
						>
							Seleccionar uso
						</SelectItem>
						{USO_CONDOMINIO_OPTIONS.map(opt => (
							<SelectItem
								key={opt.value}
								value={opt.value}
								className='text-xs'
							>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Campo>

			<Campo label='Año de construcción'>
				<Input
					name='year_construccion'
					value={formik.values.year_construccion ?? ''}
					onChange={formik.handleChange}
					inputMode='numeric'
				/>
			</Campo>

			<Campo label='Materialidad principal de construcción'>
				<Select
					value={formik.values.materialidad || '__none__'}
					onValueChange={value => {
						const materialidad =
							value === '__none__'
								? ''
								: (value as MaterialidadPrincipalCondominio)
						const clasificacionPreliminar =
							clasificacionPreliminarDesdeMaterialidad(materialidad)
						formik.setFieldValue('materialidad', materialidad)
						formik.setFieldValue(
							'clasificacion_preliminar_incendio',
							clasificacionPreliminar,
						)
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder='Seleccionar materialidad' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem
							value='__none__'
							className='text-xs text-muted-foreground'
						>
							Seleccionar materialidad
						</SelectItem>
						{(
							Object.keys(
								MATERIALIDAD_PRINCIPAL_LABELS,
							) as MaterialidadPrincipalCondominio[]
						).map(key => (
							<SelectItem key={key} value={key} className='text-xs'>
								{MATERIALIDAD_PRINCIPAL_LABELS[key]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Campo>

			<Campo label='Clasificación preliminar incendio'>
				<Input
					readOnly
					disabled
					tabIndex={-1}
					className='h-9 text-sm shadow-none cursor-default bg-muted/40 text-foreground opacity-100 w-fit'
					value={
						formik.values.clasificacion_preliminar_incendio
							? CLASIFICACION_PRELIMINAR_INCENDIO_LABELS[
									formik.values
										.clasificacion_preliminar_incendio as ClasificacionPreliminarIncendio
								]
							: '—'
					}
					aria-label='Clasificación preliminar incendio (calculada automáticamente)'
				/>
				<p className='mt-1 text-xs leading-snug text-muted-foreground'>
					Valor preliminar según materialidad. La validación final
					corresponde a evaluación/proyectos.
				</p>
			</Campo>

			<SiNoSelect
				label='Cuenta con locales comerciales'
				value={formik.values.tiene_locales_comerciales}
				onChange={value =>
					formik.setFieldValue('tiene_locales_comerciales', value)
				}
			/>

			<SiNoSelect
				label='Procesos productivos'
				value={formik.values.procesos_productivos}
				onChange={value =>
					formik.setFieldValue('procesos_productivos', value)
				}
			/>
		</>
	)
}