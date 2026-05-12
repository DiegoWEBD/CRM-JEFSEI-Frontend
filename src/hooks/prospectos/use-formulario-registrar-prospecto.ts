import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import { normalizarTexto } from '@/utils/normalizar-texto'
import { useFormik } from 'formik'
import { useProspectos } from './use-prospectos'
import * as Yup from 'yup'

type UseFormularioRegistrarProspecto = {
	onProspectoRegistrado?: () => void
	onClose?: () => void
}

export const useFormularioRegistrarProspecto = ({
	onClose,
	onProspectoRegistrado,
}: UseFormularioRegistrarProspecto = {}) => {
	const { crearProspecto, cargando } = useProspectos()

	const validationSchema = Yup.object({
		nombre_riesgo: Yup.string().required('El nombre del riesgo es obligatorio'),

		nombre_contacto: Yup.string().required(
			'El nombre del contacto es obligatorio',
		),

		telefono_contacto: Yup.string().required('El teléfono es obligatorio'),

		correo_contacto: Yup.string().email('Correo inválido'),

		direccion: Yup.string().required('La dirección es obligatoria'),

		id_comuna: Yup.number()
			.min(1, 'La comuna es obligatoria')
			.required('La comuna es obligatoria'),

		id_linea_negocio: Yup.number()
			.min(1, 'La línea de negocio es obligatoria')
			.required('La línea de negocio es obligatoria'),

		numero_pisos: Yup.number().min(0, 'No puede ser negativo').nullable(),

		numero_torres: Yup.number().min(0, 'No puede ser negativo').nullable(),

		year_construccion: Yup.number()
			.max(new Date().getFullYear(), 'Año inválido')
			.nullable(),
	})

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
			numero_pisos: null,
			numero_torres: null,
			cantidad_departamentos: null,
			cantidad_subterraneos: null,
			tiene_piscina: '',
			year_construccion: null,
			metros_cuadrados: null,
			desea_ser_contactado: '',
		},
		onSubmit: async values => {
			await crearProspecto(
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
				normalizarTexto(values.tiene_locales_comerciales) == 'si',
				values.uso_del_condominio,
				values.numero_pisos,
				values.numero_torres,
				values.cantidad_departamentos,
				values.cantidad_subterraneos,
				normalizarTexto(values.tiene_piscina) == 'si',
				values.year_construccion,
				values.metros_cuadrados,
				normalizarTexto(values.desea_ser_contactado) == 'si',
			)

			onProspectoRegistrado?.()
			onClose?.()
		},
		validationSchema,
	})

	return {
		formik,
		cargando,
	}
}
