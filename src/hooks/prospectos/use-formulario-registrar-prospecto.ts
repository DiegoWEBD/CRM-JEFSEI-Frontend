import { registrarProspecto } from '@/aplicacion/prospectos/use-cases/registrar-prospecto/registrar-prospecto'
import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rutChilenoEstadoValidacion } from '@/utils/validar-rut'
import { useFormik } from 'formik'
import * as Yup from 'yup'

function n2(value: unknown): number | null {
	if (value === '' || value == null) return null
	return Number(value)
}

type UseFormularioRegistrarProspecto = {
	onProspectoRegistrado?: () => void
	onClose?: () => void
}

const LINEA_TO_ID: Record<string, number> = {
	condominio: 10,
	lineas_personales: 11,
}

export const useFormularioRegistrarProspecto = ({
	onClose,
	onProspectoRegistrado,
}: UseFormularioRegistrarProspecto = {}) => {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (values: FormularioInitialValues) => {
			const request = {
				rut_riesgo: values.rut_riesgo || null,
				id_administrador: values.id_administrador ?? null,
				nombre_riesgo: values.nombre_riesgo,
				telefono_contacto: values.telefono_contacto || null,
				correo_contacto: values.correo_contacto || null,
				direccion: values.direccion || null,
				region: values.region || null,
				comuna: values.comuna || null,
				observaciones: values.observaciones || null,
				id_linea_negocio: LINEA_TO_ID[values.linea_negocio] ?? 0,
				uf_por_metro_cuadrado: values.uf_por_metro_cuadrado ?? null,
				porcentaje_depreciacion: (() => {
					const n = n2(values.porcentaje_depreciacion)
					return n == null ? null : n / 100
				})(),
				porcentaje_espacios_comunes: (() => {
					const n = n2(values.porcentaje_espacios_comunes)
					return n == null ? null : n / 100
				})(),
				tiene_locales_comerciales: values.tiene_locales_comerciales ?? null,
				uso_del_condominio: values.uso_del_condominio || null,
				materialidad: values.materialidad || null,
				clasificacion_preliminar_incendio:
					values.clasificacion_preliminar_incendio || null,
				procesos_productivos: values.procesos_productivos ?? null,
				numero_pisos: values.numero_pisos ?? null,
				numero_torres: values.numero_torres ?? null,
				cantidad_departamentos: values.cantidad_departamentos ?? null,
				cantidad_subterraneos: values.cantidad_subterraneos ?? null,
				tiene_piscina: values.tiene_piscina ?? null,
				ubicacion_piscina: values.ubicacion_piscina || null,
				tiene_alarma_incendio: values.tiene_alarma_incendio ?? null,
				tiene_sprinklers: values.tiene_sprinklers ?? null,
				year_construccion: values.year_construccion ?? null,
				metros_cuadrados: values.metros_cuadrados ?? null,
			}

			await registrarProspecto(request)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['prospectos'] })
			onProspectoRegistrado?.()
			onClose?.()
		},
	})

	const validationSchema = Yup.object({
		rut_riesgo: Yup.string()
			.test('rut-valido', 'RUT inválido.', value => {
				if (!value || value.trim() === '') return true
				return rutChilenoEstadoValidacion(value) === 'valido'
			})
			.nullable(),

		nombre_riesgo: Yup.string().required('El nombre del riesgo es obligatorio'),

		correo_contacto: Yup.string().email('Correo inválido').nullable(),

		linea_negocio: Yup.string()
			.oneOf(
				['condominio', 'lineas_personales'],
				'La línea de negocio es obligatoria',
			)
			.required('La línea de negocio es obligatoria'),

		numero_pisos: Yup.number()
			.min(0, 'No puede ser negativo')
			.nullable()
			.default(null),

		numero_torres: Yup.number()
			.min(0, 'No puede ser negativo')
			.nullable()
			.default(null),

		year_construccion: Yup.number()
			.min(1900, 'Año debe ser mayor a 1900')
			.max(new Date().getFullYear(), 'Año inválido')
			.nullable()
			.default(null),

		metros_cuadrados: Yup.number()
			.min(0, 'Debe ingresar un número mayor a 0')
			.nullable()
			.default(null),

		uf_por_metro_cuadrado: Yup.number()
			.min(0, 'Debe ingresar un número mayor a 0')
			.nullable()
			.default(null),

		porcentaje_depreciacion: Yup.number()
			.min(0, 'Debe ingresar un número entre 0 y 100')
			.max(100, 'Debe ingresar un número entre 0 y 100')
			.nullable()
			.default(null),

		porcentaje_espacios_comunes: Yup.number()
			.min(0, 'Debe ingresar un número entre 0 y 100')
			.max(100, 'Debe ingresar un número entre 0 y 100')
			.nullable()
			.default(null),

		cantidad_departamentos: Yup.number()
			.min(0, 'No puede ser negativo')
			.nullable()
			.default(null),

		cantidad_subterraneos: Yup.number()
			.min(0, 'No puede ser negativo')
			.nullable()
			.default(null),
	})

	const formik = useFormik<FormularioInitialValues>({
		initialValues: {
			rut_riesgo: '',
			nombre_riesgo: '',
			telefono_contacto: '',
			correo_contacto: '',
			direccion: '',
			region: '',
			comuna: '',
			observaciones: '',
			linea_negocio: 'lineas_personales',
			id_administrador: undefined,
			tiene_locales_comerciales: undefined,
			uso_del_condominio: '',
			materialidad: '',
			clasificacion_preliminar_incendio: '',
			procesos_productivos: undefined,
			numero_pisos: undefined,
			numero_torres: undefined,
			cantidad_departamentos: undefined,
			cantidad_subterraneos: undefined,
			tiene_piscina: undefined,
			ubicacion_piscina: '',
			tiene_alarma_incendio: undefined,
			tiene_sprinklers: undefined,
			year_construccion: undefined,
			metros_cuadrados: undefined,
			uf_por_metro_cuadrado: undefined,
			porcentaje_depreciacion: undefined,
			porcentaje_espacios_comunes: undefined,
		},
		onSubmit: async values => {
			await mutation.mutateAsync(values)
		},
		validationSchema,
	})

	return {
		formik,
		cargando: mutation.isPending,
	}
}
