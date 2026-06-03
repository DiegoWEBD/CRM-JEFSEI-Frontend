import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import Campo from '@/components/forms/campo/campo'
import Input from '@/components/forms/input/input'
import SiNoSelect from '@/components/forms/si-no-select/si-no-select'
import { inputPendiente } from '@/utils/input/input-pendiente'
import { FormikProps } from 'formik'
import { inp } from '../formulario-actualizar-prospecto'

type CamposAdicionalesProspectoCondominioProps = {
	formik: FormikProps<FormularioInitialValues>
}

export default function CamposAdicionalesProspectoCondominio({
	formik,
}: CamposAdicionalesProspectoCondominioProps) {
	return (
		<>
			<SiNoSelect
				label='Cuenta con locales comerciales'
				value={formik.values.tiene_locales_comerciales}
				onChange={value =>
					formik.setFieldValue('tiene_locales_comerciales', value)
				}
			/>
			<SiNoSelect
				label='Cuenta con piscina'
				value={formik.values.tiene_piscina}
				onChange={value => formik.setFieldValue('tiene_piscina', value)}
			/>
			<Campo label='Uso del condominio'>
				<Input
					className={inp(inputPendiente(formik.values.uso_del_condominio))}
					name='uso_del_condominio'
					value={formik.values.uso_del_condominio}
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
			<Campo label='Número de departamentos'>
				<Input
					className={inp(inputPendiente(formik.values.cantidad_departamentos))}
					name='cantidad_departamentos'
					value={formik.values.cantidad_departamentos}
					onChange={formik.handleChange}
				/>
			</Campo>
			<Campo label='Número de subterráneos'>
				<Input
					className={inp(inputPendiente(formik.values.cantidad_subterraneos))}
					name='cantidad_subterraneos'
					value={formik.values.cantidad_subterraneos}
					onChange={formik.handleChange}
				/>
			</Campo>
			<Campo label='Año de construcción'>
				<Input
					className={inp(inputPendiente(formik.values.year_construccion))}
					name='year_construccion'
					value={formik.values.year_construccion}
					onChange={formik.handleChange}
				/>
			</Campo>
			<Campo label='Metros cuadrados construidos'>
				<Input
					className={inp(inputPendiente(formik.values.metros_cuadrados))}
					name='metros_cuadrados'
					value={formik.values.metros_cuadrados}
					onChange={formik.handleChange}
				/>
			</Campo>
			<SiNoSelect
				label='Administrador desea ser contactado'
				value={formik.values.desea_ser_contactado}
				onChange={value => formik.setFieldValue('desea_ser_contactado', value)}
			/>
		</>
	)
}
