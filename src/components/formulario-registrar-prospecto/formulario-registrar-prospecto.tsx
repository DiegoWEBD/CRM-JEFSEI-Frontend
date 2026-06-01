import Button from '@/components/button/button'
import Form from '@/components/forms/form/form'
import Input from '@/components/forms/input/input'
import Select from '@/components/forms/select/select'
import { useComunas } from '@/hooks/comunas/use-comunas'
import { useLineasNegocio } from '@/hooks/lineas-negocio/use-lineas-negocio'
import { useFormularioRegistrarProspecto } from '@/hooks/prospectos/use-formulario-registrar-prospecto'
import FormError from '../forms/form-error/form-error'
import FormRow from '../forms/form-row/form-row'
import Label from '../forms/label/label'
import SelectContent from '../forms/select/select-content/select-content'
import SelectItem from '../forms/select/select-item/select-item'
import SelectTrigger from '../forms/select/select-trigger/select-trigger'
import SelectValue from '../forms/select/select-value/select-value'

type FormularioRegistrarProspectoProps = {
	onProspectoRegistrado?: () => void
	onClose?: () => void
}

const FormularioRegistrarProspecto = ({
	onProspectoRegistrado,
	onClose,
}: FormularioRegistrarProspectoProps) => {
	const { formik, cargando } = useFormularioRegistrarProspecto({
		onProspectoRegistrado,
		onClose,
	})

	const { data: lineasNegocio } = useLineasNegocio()
	const { data: comunas } = useComunas()

	return (
		<Form
			onSubmit={formik.handleSubmit}
			className='grid! grid-cols-1! md:grid-cols-2! gap-4!'
		>
			<FormRow>
				<Label>Rut</Label>
				<Input
					name='rut_riesgo'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.rut_riesgo}
				/>
				{formik.touched.rut_riesgo && formik.errors.rut_riesgo ? (
					<FormError>{formik.errors.rut_riesgo}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Nombre / Razón social</Label>
				<Input
					name='nombre_riesgo'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.nombre_riesgo}
				/>
				{formik.touched.nombre_riesgo && formik.errors.nombre_riesgo ? (
					<FormError>{formik.errors.nombre_riesgo}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Nombre contacto</Label>
				<Input
					name='nombre_contacto'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.nombre_contacto}
				/>
				{formik.touched.nombre_contacto && formik.errors.nombre_contacto ? (
					<FormError>{formik.errors.nombre_contacto}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Cargo contacto</Label>
				<Input
					name='cargo_contacto'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.cargo_contacto}
				/>
				{formik.touched.cargo_contacto && formik.errors.cargo_contacto ? (
					<FormError>{formik.errors.cargo_contacto}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Correo contacto</Label>
				<Input
					name='correo_contacto'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.correo_contacto}
				/>
				{formik.touched.correo_contacto && formik.errors.correo_contacto ? (
					<FormError>{formik.errors.correo_contacto}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Teléfono contacto</Label>
				<Input
					name='telefono_contacto'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.telefono_contacto}
				/>
				{formik.touched.telefono_contacto && formik.errors.telefono_contacto ? (
					<FormError>{formik.errors.telefono_contacto}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Dirección</Label>
				<Input
					name='direccion'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.direccion}
				/>
				{formik.touched.direccion && formik.errors.direccion ? (
					<FormError>{formik.errors.direccion}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Comuna</Label>
				<Select
					name='id_comuna'
					onValueChange={value =>
						formik.setFieldValue('id_comuna', Number(value))
					}
				>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Seleccione una comuna' />
					</SelectTrigger>
					<SelectContent>
						{comunas?.map(comuna => (
							<SelectItem key={comuna.id} value={comuna.id.toString()}>
								{comuna.nombre}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{formik.touched.id_comuna && formik.errors.id_comuna ? (
					<FormError>{formik.errors.id_comuna}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Observaciones</Label>
				<Input
					name='observaciones'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.observaciones}
					className='md:col-span-2'
				/>
				{formik.touched.observaciones && formik.errors.observaciones ? (
					<FormError>{formik.errors.observaciones}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Línea de negocio</Label>
				<Select
					name='id_linea_negocio'
					onValueChange={value =>
						formik.setFieldValue('id_linea_negocio', Number(value))
					}
				>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Seleccione una línea de negocio' />
					</SelectTrigger>
					<SelectContent>
						{lineasNegocio?.map(lineaNegocio => (
							<SelectItem
								key={lineaNegocio.id}
								value={lineaNegocio.id.toString()}
							>
								{lineaNegocio.nombre}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{formik.touched.id_linea_negocio && formik.errors.id_linea_negocio ? (
					<FormError>{formik.errors.id_linea_negocio}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Cuenta con locales comerciales</Label>
				<Input
					name='tiene_locales_comerciales'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.tiene_locales_comerciales}
				/>
				{formik.touched.tiene_locales_comerciales &&
				formik.errors.tiene_locales_comerciales ? (
					<FormError>{formik.errors.tiene_locales_comerciales}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Uso del condominio</Label>
				<Input
					name='uso_del_condominio'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.uso_del_condominio}
				/>
				{formik.touched.uso_del_condominio &&
				formik.errors.uso_del_condominio ? (
					<FormError>{formik.errors.uso_del_condominio}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Número de pisos</Label>
				<Input
					name='numero_pisos'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.numero_pisos}
					type='number'
				/>
				{formik.touched.numero_pisos && formik.errors.numero_pisos ? (
					<FormError>{formik.errors.numero_pisos}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Número de torres</Label>
				<Input
					name='numero_torres'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.numero_torres}
					type='number'
				/>
				{formik.touched.numero_torres && formik.errors.numero_torres ? (
					<FormError>{formik.errors.numero_torres}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Número de departamentos</Label>
				<Input
					name='cantidad_departamentos'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.cantidad_departamentos}
					type='number'
				/>
				{formik.touched.cantidad_departamentos &&
				formik.errors.cantidad_departamentos ? (
					<FormError>{formik.errors.cantidad_departamentos}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Número de subterraneos</Label>
				<Input
					name='cantidad_subterraneos'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.cantidad_subterraneos}
					type='number'
				/>
				{formik.touched.cantidad_subterraneos &&
				formik.errors.cantidad_subterraneos ? (
					<FormError>{formik.errors.cantidad_subterraneos}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Cuenta con piscina</Label>
				<Input
					name='tiene_piscina'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.tiene_piscina}
				/>
				{formik.touched.tiene_piscina && formik.errors.tiene_piscina ? (
					<FormError>{formik.errors.tiene_piscina}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Año de construcción</Label>
				<Input
					name='year_construccion'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.year_construccion}
					type='number'
				/>
				{formik.touched.year_construccion && formik.errors.year_construccion ? (
					<FormError>{formik.errors.year_construccion}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Metros cuadrados</Label>
				<Input
					name='metros_cuadrados'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.metros_cuadrados}
					type='number'
				/>
				{formik.touched.metros_cuadrados && formik.errors.metros_cuadrados ? (
					<FormError>{formik.errors.metros_cuadrados}</FormError>
				) : null}
			</FormRow>

			<FormRow>
				<Label>Administrador desea ser contactado</Label>
				<Input
					name='desea_ser_contactado'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.desea_ser_contactado}
				/>
				{formik.touched.desea_ser_contactado &&
				formik.errors.desea_ser_contactado ? (
					<FormError>{formik.errors.desea_ser_contactado}</FormError>
				) : null}
			</FormRow>

			<div className='md:col-span-2 flex justify-end'>
				<Button type='submit'>
					{cargando ? 'Registrando...' : 'Registrar'}
				</Button>
			</div>
		</Form>
	)
}

export default FormularioRegistrarProspecto
