import Button from '@/components/botones/button'
import Form from '@/components/forms/form/form'
import Input from '@/components/forms/input/input'
import Select from '@/components/forms/select/select'
import { useComunas } from '@/hooks/comunas/use-comunas'
import { useLineasNegocio } from '@/hooks/lineas-negocio/use-lineas-negocio'
import { useFormularioRegistrarProspecto } from '@/hooks/prospectos/use-formulario-registrar-prospecto'

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

	const { lineasNegocio, cargarLineasNegocio } = useLineasNegocio()
	const { comunas, cargarComunas } = useComunas()

	return (
		<div>
			<p className='text-sm text-gray-500 mb-4'>
				Completa los datos del prospecto para crear un nuevo registro.
			</p>
			<Form
				onSubmit={formik.handleSubmit}
				className='grid! grid-cols-1! md:grid-cols-2! gap-4!'
			>
				<Input
					name='rut_riesgo'
					label='Rut riesgo'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.rut_riesgo}
					error={
						formik.touched.rut_riesgo ? formik.errors.rut_riesgo : undefined
					}
				/>

				<Input
					name='nombre_riesgo'
					label='Nombre riesgo'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.nombre_riesgo}
					error={
						formik.touched.nombre_riesgo
							? formik.errors.nombre_riesgo
							: undefined
					}
				/>

				<Input
					name='nombre_contacto'
					label='Nombre contacto'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.nombre_contacto}
					error={
						formik.touched.nombre_contacto
							? formik.errors.nombre_contacto
							: undefined
					}
				/>

				<Input
					name='cargo_contacto'
					label='Cargo contacto'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.cargo_contacto}
					error={
						formik.touched.cargo_contacto
							? formik.errors.cargo_contacto
							: undefined
					}
				/>

				<Input
					name='correo_contacto'
					label='Correo contacto'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.correo_contacto}
					error={
						formik.touched.correo_contacto
							? formik.errors.correo_contacto
							: undefined
					}
				/>

				<Input
					name='telefono_contacto'
					label='Teléfono contacto'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.telefono_contacto}
					error={
						formik.touched.telefono_contacto
							? formik.errors.telefono_contacto
							: undefined
					}
				/>

				<Input
					name='direccion'
					label='Dirección'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.direccion}
					error={formik.touched.direccion ? formik.errors.direccion : undefined}
				/>

				<Select
					name='id_comuna'
					label='Id comuna'
					value={formik.values.id_comuna}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					onFocus={() => {
						if (comunas.length === 0) {
							cargarComunas()
						}
					}}
					options={comunas.map(comuna => ({
						value: comuna.id,
						label: comuna.nombre,
					}))}
					placeholder='Selecciona una comuna'
					error={formik.touched.id_comuna ? formik.errors.id_comuna : undefined}
				/>

				<Input
					name='observaciones'
					label='Observaciones'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.observaciones}
					className='md:col-span-2'
					error={
						formik.touched.observaciones
							? formik.errors.observaciones
							: undefined
					}
				/>

				<Select
					name='id_linea_negocio'
					label='Línea de negocio'
					value={formik.values.id_linea_negocio}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					onFocus={() => {
						if (lineasNegocio.length === 0) {
							cargarLineasNegocio()
						}
					}}
					options={lineasNegocio.map(linea => ({
						value: linea.id,
						label: linea.nombre,
					}))}
					placeholder='Selecciona una línea de negocio'
					error={
						formik.touched.id_linea_negocio
							? formik.errors.id_linea_negocio
							: undefined
					}
				/>

				<Input
					name='tiene_locales_comerciales'
					label='Cuenta con locales comerciales'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.tiene_locales_comerciales}
					error={
						formik.touched.tiene_locales_comerciales
							? formik.errors.tiene_locales_comerciales
							: undefined
					}
				/>

				<Input
					name='uso_del_condominio'
					label='Uso del condominio'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.uso_del_condominio}
					error={
						formik.touched.uso_del_condominio
							? formik.errors.uso_del_condominio
							: undefined
					}
				/>

				<Input
					name='numero_pisos'
					label='Número de pisos'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.numero_pisos}
					type='number'
					error={
						formik.touched.numero_pisos ? formik.errors.numero_pisos : undefined
					}
				/>

				<Input
					name='numero_torres'
					label='Número de torres'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.numero_torres}
					type='number'
					error={
						formik.touched.numero_torres
							? formik.errors.numero_torres
							: undefined
					}
				/>

				<Input
					name='cantidad_departamentos'
					label='Número de departamentos'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.cantidad_departamentos}
					type='number'
					error={
						formik.touched.cantidad_departamentos
							? formik.errors.cantidad_departamentos
							: undefined
					}
				/>

				<Input
					name='cantidad_subterraneos'
					label='Número de subterráneos'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.cantidad_subterraneos}
					type='number'
					error={
						formik.touched.cantidad_subterraneos
							? formik.errors.cantidad_subterraneos
							: undefined
					}
				/>

				<Input
					name='tiene_piscina'
					label='Cuenta con piscina'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.tiene_piscina}
					error={
						formik.touched.tiene_piscina
							? formik.errors.tiene_piscina
							: undefined
					}
				/>

				<Input
					name='year_construccion'
					label='Año de construcción'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.year_construccion}
					type='number'
					error={
						formik.touched.year_construccion
							? formik.errors.year_construccion
							: undefined
					}
				/>

				<Input
					name='metros_cuadrados'
					label='Metros cuadrados'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.metros_cuadrados}
					type='number'
					error={
						formik.touched.metros_cuadrados
							? formik.errors.metros_cuadrados
							: undefined
					}
				/>

				<Input
					name='desea_ser_contactado'
					label='Administrador desea ser contactado'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.desea_ser_contactado}
					error={
						formik.touched.desea_ser_contactado
							? formik.errors.desea_ser_contactado
							: undefined
					}
				/>

				<div className='md:col-span-2 flex justify-end'>
					<Button type='submit'>
						{cargando ? 'Registrando...' : 'Registrar'}
					</Button>
				</div>
			</Form>
		</div>
	)
}

export default FormularioRegistrarProspecto
