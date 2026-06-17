import { registrarProspecto } from '@/aplicacion/prospectos/use-cases/registrar-prospecto/registrar-prospecto'
import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import { normalizarTexto } from '@/utils/normalizar-texto'
import { useFormik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'

type UseFormularioRegistrarProspecto = {
	onProspectoRegistrado?: () => void
	onClose?: () => void
}

export const useFormularioRegistrarProspecto = ({
	onClose,
	onProspectoRegistrado,
}: UseFormularioRegistrarProspecto = {}) => {
	const [cargando, setCargando] = useState(false)

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
			tiene_locales_comerciales: undefined,
			uso_del_condominio: '',
			numero_pisos: undefined,
			numero_torres: undefined,
			cantidad_departamentos: undefined,
			cantidad_subterraneos: undefined,
			tiene_piscina: undefined,
			year_construccion: undefined,
			metros_cuadrados: undefined,
			desea_ser_contactado: '',
		},
		onSubmit: async values => {
			setCargando(true)

			await registrarProspecto(
				values.rut_riesgo ?? null,
				values.nombre_riesgo,
				values.nombre_contacto,
				values.telefono_contacto,
				values.correo_contacto ?? null,
				values.direccion,
				values.id_comuna,
				values.observaciones ?? null,
				values.id_linea_negocio,
				values.cargo_contacto ?? null,
				values.tiene_locales_comerciales
					? normalizarTexto(values.tiene_locales_comerciales) == 'si'
					: null,
				values.uso_del_condominio ?? null,
				values.numero_pisos ?? null,
				values.numero_torres ?? null,
				values.cantidad_departamentos ?? null,
				values.cantidad_subterraneos ?? null,
				values.tiene_piscina
					? normalizarTexto(values.tiene_piscina) == 'si'
					: null,
				values.year_construccion ?? null,
				values.metros_cuadrados ?? null,
				values.desea_ser_contactado
					? normalizarTexto(values.desea_ser_contactado) == 'si'
					: null,
			)

			setCargando(false)
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
