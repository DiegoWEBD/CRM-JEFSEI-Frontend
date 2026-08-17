import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import Campo from '@/components/forms/campo/campo'
import Input from '@/components/forms/input/input'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import SiNoSelect from '@/components/forms/si-no-select/si-no-select'
import { classname } from '@/lib/class-name'
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
import { inputPendiente } from '@/utils/input/input-pendiente'
import { FormikProps } from 'formik'
import { useMemo } from 'react'
import { inp } from '@/utils/form-utils'
import { useAdministradores } from '@/hooks/administradores/use-administradores'
import { SelectorAdministrador } from '@/components/selector-administrador'

type CamposAdicionalesProspectoCondominioProps = {
	formik: FormikProps<FormularioInitialValues>
}

export default function CamposAdicionalesProspectoCondominio({
	formik,
}: CamposAdicionalesProspectoCondominioProps) {
	const ubicacionPiscinaPendiente = useMemo(() => {
		if (formik.values.tiene_piscina === undefined) return true
		else if (!formik.values.tiene_piscina) return false
		else if (
			formik.values.ubicacion_piscina === undefined ||
			formik.values.ubicacion_piscina === ''
		)
			return true
		else return false
	}, [formik.values.tiene_piscina, formik.values.ubicacion_piscina])

	const { data: administradores } = useAdministradores()

	return (
		<>
			<Campo label='Administrador'>
				<SelectorAdministrador
					value={formik.values.id_administrador}
					onChange={id => formik.setFieldValue('id_administrador', id)}
					administradores={administradores ?? []}
				/>
			</Campo>

			<Campo label='Uso del condominio'>
				<Input
					className={inp(inputPendiente(formik.values.uso_del_condominio))}
					name='uso_del_condominio'
					value={formik.values.uso_del_condominio}
					onChange={formik.handleChange}
				/>
			</Campo>

			<Campo
				label='Materialidad principal de construcción'
				labelClassName={
					inputPendiente(formik.values.materialidad)
						? 'text-warning'
						: undefined
				}
			>
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
					<SelectTrigger
						className={inp(inputPendiente(formik.values.materialidad))}
					>
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

			<Campo
				label='Clasificación preliminar incendio'
				labelClassName={
					inputPendiente(formik.values.clasificacion_preliminar_incendio)
						? 'text-warning'
						: undefined
				}
			>
				<Input
					readOnly
					disabled
					tabIndex={-1}
					className={classname(
						'h-9 text-sm shadow-none cursor-default bg-muted/40 text-foreground opacity-100 w-fit',
						inp(
							inputPendiente(formik.values.clasificacion_preliminar_incendio),
						),
					)}
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
					className={inp(inputPendiente(formik.values.year_construccion))}
					name='year_construccion'
					value={formik.values.year_construccion}
					onChange={formik.handleChange}
				/>
			</Campo>

			<SiNoSelect
				label='Cuenta con locales comerciales'
				value={formik.values.tiene_locales_comerciales}
				labelClassName={
					inputPendiente(formik.values.tiene_locales_comerciales)
						? 'text-warning'
						: undefined
				}
				triggerClassName={inp(
					inputPendiente(formik.values.tiene_locales_comerciales),
				)}
				onChange={value =>
					formik.setFieldValue('tiene_locales_comerciales', value)
				}
			/>

			<SiNoSelect
				label='Procesos productivos'
				value={formik.values.procesos_productivos}
				labelClassName={
					inputPendiente(formik.values.procesos_productivos)
						? 'text-warning'
						: undefined
				}
				triggerClassName={inp(
					inputPendiente(formik.values.procesos_productivos),
				)}
				onChange={value => formik.setFieldValue('procesos_productivos', value)}
			/>

			<Campo label='Total m² construidos'>
				<Input
					className={inp(inputPendiente(formik.values.metros_cuadrados))}
					name='metros_cuadrados'
					value={formik.values.metros_cuadrados}
					onChange={formik.handleChange}
				/>
			</Campo>

			<Campo label='Número de pisos'>
				<Input
					className={inp(inputPendiente(formik.values.numero_pisos))}
					name='numero_pisos'
					value={formik.values.numero_pisos}
					onChange={formik.handleChange}
				/>
			</Campo>

			<Campo label='Número de torres'>
				<Input
					className={inp(inputPendiente(formik.values.numero_torres))}
					name='numero_torres'
					value={formik.values.numero_torres}
					onChange={formik.handleChange}
				/>
			</Campo>

			<Campo label='Cantidad de departamentos'>
				<Input
					className={inp(inputPendiente(formik.values.cantidad_departamentos))}
					name='cantidad_departamentos'
					value={formik.values.cantidad_departamentos}
					onChange={formik.handleChange}
				/>
			</Campo>

			<Campo label='Cantidad de subterráneos'>
				<Input
					className={inp(inputPendiente(formik.values.cantidad_subterraneos))}
					name='cantidad_subterraneos'
					value={formik.values.cantidad_subterraneos}
					onChange={formik.handleChange}
				/>
			</Campo>

			<SiNoSelect
				label='Cuenta con piscina'
				value={formik.values.tiene_piscina}
				labelClassName={
					inputPendiente(formik.values.tiene_piscina)
						? 'text-warning'
						: undefined
				}
				triggerClassName={inp(inputPendiente(formik.values.tiene_piscina))}
				onChange={value => formik.setFieldValue('tiene_piscina', value)}
			/>

			<Campo
				label='Ubicación de la piscina'
				labelClassName={
					ubicacionPiscinaPendiente
						? 'text-warning'
						: undefined
				}
			>
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
						className={classname(
							'h-9 text-sm shadow-none',
							!formik.values.tiene_piscina && 'cursor-not-allowed opacity-70',
							inp(ubicacionPiscinaPendiente),
						)}
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
				labelClassName={
					inputPendiente(formik.values.tiene_alarma_incendio)
						? 'text-warning'
						: undefined
				}
				triggerClassName={inp(
					inputPendiente(formik.values.tiene_alarma_incendio),
				)}
				onChange={value => formik.setFieldValue('tiene_alarma_incendio', value)}
			/>

			<SiNoSelect
				label='Cuenta con sprinklers'
				value={formik.values.tiene_sprinklers}
				labelClassName={
					inputPendiente(formik.values.tiene_sprinklers)
						? 'text-warning'
						: undefined
				}
				triggerClassName={inp(inputPendiente(formik.values.tiene_sprinklers))}
				onChange={value => formik.setFieldValue('tiene_sprinklers', value)}
			/>
		</>
	)
}
