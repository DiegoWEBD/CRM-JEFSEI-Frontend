import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import Campo from '@/components/forms/campo/campo'
import Input from '@/components/forms/input/input'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import SiNoSelect from '@/components/forms/si-no-select/si-no-select'
import {
	CLASIFICACION_PRELIMINAR_INCENDIO_LABELS,
	clasificacionPreliminarDesdeMaterialidad,
	ClasificacionPreliminarIncendio,
	MATERIALIDAD_PRINCIPAL_LABELS,
	MaterialidadPrincipalCondominio,
} from '@/lib/materialidades'
import {
	UBICACION_PISCINA_LABELS,
	UBICACION_PISCINA_OPCIONES_CON_PISCINA,
	UbicacionPiscinaCondominio,
} from '@/lib/ubicacion.piscina'
import { FormikProps } from 'formik'
import { SelectorAdministrador } from '@/components/selector-administrador'

type CamposAdicionalesProspectoCondominioProps = {
	formik: FormikProps<FormularioInitialValues>
}

export default function CamposAdicionalesProspectoCondominio({
	formik,
}: CamposAdicionalesProspectoCondominioProps) {
	return (
		<>
			<Campo label='Administrador'>
				<SelectorAdministrador
					value={formik.values.id_administrador}
					onChange={id => formik.setFieldValue('id_administrador', id)}
				/>
			</Campo>

			<Campo label='Uso del condominio'>
				<Input
					name='uso_del_condominio'
					value={formik.values.uso_del_condominio}
					onChange={formik.handleChange}
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
					Valor preliminar según materialidad. La validación final corresponde a
					evaluación/proyectos.
				</p>
			</Campo>

			<Campo label='Año de construcción'>
				<Input
					name='year_construccion'
					value={formik.values.year_construccion}
					onChange={formik.handleChange}
				/>
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
				onChange={value => formik.setFieldValue('procesos_productivos', value)}
			/>

			<Campo label='Total m² construidos'>
				<Input
					name='metros_cuadrados'
					value={formik.values.metros_cuadrados}
					onChange={formik.handleChange}
				/>
			</Campo>

			<Campo label='Número de pisos'>
				<Input
					name='numero_pisos'
					value={formik.values.numero_pisos}
					onChange={formik.handleChange}
				/>
			</Campo>

			<Campo label='Número de torres'>
				<Input
					name='numero_torres'
					value={formik.values.numero_torres}
					onChange={formik.handleChange}
				/>
			</Campo>

			<Campo label='Cantidad de departamentos'>
				<Input
					name='cantidad_departamentos'
					value={formik.values.cantidad_departamentos}
					onChange={formik.handleChange}
				/>
			</Campo>

			<Campo label='Cantidad de subterráneos'>
				<Input
					name='cantidad_subterraneos'
					value={formik.values.cantidad_subterraneos}
					onChange={formik.handleChange}
				/>
			</Campo>

			<SiNoSelect
				label='Cuenta con piscina'
				value={formik.values.tiene_piscina}
				onChange={value => formik.setFieldValue('tiene_piscina', value)}
			/>

			<Campo label='Ubicación de la piscina'>
				<Select
					disabled={!formik.values.tiene_piscina}
					value={
						!formik.values.tiene_piscina
							? 'no_aplica'
							: formik.values.ubicacion_piscina || '__none__'
					}
					onValueChange={value => {
						const ubicacionPiscina =
							value === '__none__'
								? undefined
								: (value as UbicacionPiscinaCondominio)
						formik.setFieldValue('ubicacion_piscina', ubicacionPiscina)
					}}
				>
					<SelectTrigger
						className={
							!formik.values.tiene_piscina
								? 'cursor-not-allowed opacity-70'
								: undefined
						}
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

			<SiNoSelect
				label='Cuenta con alarma de incendio'
				value={formik.values.tiene_alarma_incendio}
				onChange={value => formik.setFieldValue('tiene_alarma_incendio', value)}
			/>

			<SiNoSelect
				label='Cuenta con sprinklers'
				value={formik.values.tiene_sprinklers}
				onChange={value => formik.setFieldValue('tiene_sprinklers', value)}
			/>
		</>
	)
}
