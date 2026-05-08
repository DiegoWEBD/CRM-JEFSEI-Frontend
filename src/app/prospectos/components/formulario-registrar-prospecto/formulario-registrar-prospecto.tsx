import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import { useProspectos } from '@/hooks/prospectos/use-prospectos'
import { useFormik } from 'formik'
import { FiUserPlus } from 'react-icons/fi'
import { FormularioInitialValues } from '../dto/formulario-initial-values'
import Form from '@/components/forms/form/form'
import Input from '@/components/forms/input/input'
import Button from '@/components/botones/button'

const FormularioRegistrarProspecto = () => {
	const { crearProspecto, cargando } = useProspectos()
	const formik = useFormik<FormularioInitialValues>({
		initialValues: {
			rut_riesgo: '',
			nombre_riesgo: '',
			nombre_contacto: '',
			telefono_contacto: '',
			correo_contacto: '',
			direccion: '',
			id_comuna: 0,
			observaciones: '',
			id_linea_negocio: 0,
			cargo_contacto: '',
			tiene_locales_comerciales: '',
			uso_del_condominio: '',
			numero_pisos: undefined,
			numero_torres: undefined,
			cantidad_departamentos: undefined,
			cantidad_subterraneos: undefined,
			tiene_piscina: '',
			year_construccion: undefined,
			metros_cuadrados: undefined,
			desea_ser_contactado: '',
		},
		onSubmit: values => {
			console.log(values)
			crearProspecto(
				values.rut_riesgo,
				values.nombre_riesgo,
				values.nombre_contacto,
				values.telefono_contacto,
				values.correo_contacto,
				values.direccion,
				values.id_comuna,
				values.observaciones,
				values.id_linea_negocio,
				values.cargo_contacto,
				values.tiene_locales_comerciales == 'Sí',
				values.uso_del_condominio,
				values.numero_pisos,
				values.numero_torres,
				values.cantidad_departamentos,
				values.cantidad_subterraneos,
				values.tiene_piscina == 'Sí',
				values.year_construccion,
				values.metros_cuadrados,
				values.desea_ser_contactado == 'Sí',
			)
		},
	})

	return (
		<div className='h-[80vh] overflow-auto border-0 p-3'>
			<CardHeader title='Registrar prospecto' icon={<FiUserPlus />} primary />
			<Form onSubmit={formik.handleSubmit}>
				<Input
					name='rut_riesgo'
					label='Rut riesgo'
					onChange={formik.handleChange}
					value={formik.values.rut_riesgo}
				/>

				<Input
					name='nombre_riesgo'
					label='Nombre riesgo'
					onChange={formik.handleChange}
					value={formik.values.nombre_riesgo}
				/>

				<Input
					name='nombre_contacto'
					label='Nombre contacto'
					onChange={formik.handleChange}
					value={formik.values.nombre_contacto}
				/>

				<Input
					name='telefono_contacto'
					label='Teléfono contacto'
					onChange={formik.handleChange}
					value={formik.values.telefono_contacto}
				/>

				<Input
					name='correo_contacto'
					label='Correo contacto'
					onChange={formik.handleChange}
					value={formik.values.correo_contacto}
				/>

				<Input
					name='direccion'
					label='Dirección'
					onChange={formik.handleChange}
					value={formik.values.direccion}
				/>

				<Input
					name='id_comuna'
					label='Id comuna'
					onChange={formik.handleChange}
					value={formik.values.id_comuna}
					type='number'
				/>

				<Input
					name='observaciones'
					label='Observaciones'
					onChange={formik.handleChange}
					value={formik.values.observaciones}
				/>

				<Input
					name='id_linea_negocio'
					label='Id línea de negocio'
					onChange={formik.handleChange}
					value={formik.values.id_linea_negocio}
					type='number'
				/>

				<Input
					name='cargo_contacto'
					label='Cargo contacto'
					onChange={formik.handleChange}
					value={formik.values.cargo_contacto}
				/>

				<Input
					name='tiene_locales_comerciales'
					label='Cuenta con locales comerciales'
					onChange={formik.handleChange}
					value={formik.values.tiene_locales_comerciales}
				/>

				<Input
					name='uso_del_condominio'
					label='Uso del condominio'
					onChange={formik.handleChange}
					value={formik.values.uso_del_condominio}
				/>

				<Input
					name='numero_pisos'
					label='Número de pisos'
					onChange={formik.handleChange}
					value={formik.values.numero_pisos}
					type='number'
				/>

				<Input
					name='numero_torres'
					label='Número de torres'
					onChange={formik.handleChange}
					value={formik.values.numero_torres}
					type='number'
				/>

				<Input
					name='cantidad_departamentos'
					label='Número de departamentos'
					onChange={formik.handleChange}
					value={formik.values.cantidad_departamentos}
					type='number'
				/>

				<Input
					name='cantidad_subterraneos'
					label='Número de subterráneos'
					onChange={formik.handleChange}
					value={formik.values.cantidad_subterraneos}
					type='number'
				/>

				<Input
					name='tiene_piscina'
					label='Cuenta con piscina'
					onChange={formik.handleChange}
					value={formik.values.tiene_piscina}
				/>

				<Input
					name='year_construccion'
					label='Año de construcción'
					onChange={formik.handleChange}
					value={formik.values.year_construccion}
					type='number'
				/>

				<Input
					name='metros_cuadrados'
					label='Metros cuadrados'
					onChange={formik.handleChange}
					value={formik.values.metros_cuadrados}
					type='number'
				/>

				<Input
					name='desea_ser_contactado'
					label='Administrador desea ser contactado'
					onChange={formik.handleChange}
					value={formik.values.desea_ser_contactado}
				/>

				<Button type='submit'>Registrar</Button>
			</Form>
		</div>
	)
}

export default FormularioRegistrarProspecto
