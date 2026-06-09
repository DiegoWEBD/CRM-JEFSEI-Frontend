import { actualizarProspectoCondominio } from '@/aplicacion/prospectos/use-cases/actualizar-prospecto-condominio/actualizar-prospecto-condominio'
import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'

type UseFormularioActualizarProspecto = {
	prospecto: ProspectoCondominio
	onComplete?: () => void
}

export const useFormularioActualizarProspectoCondominio = ({
	prospecto,
	onComplete,
}: UseFormularioActualizarProspecto) => {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (values: FormularioInitialValues) => {
			await actualizarProspectoCondominio(prospecto.id, {
				rut_riesgo: values.rut_riesgo ?? null,
				nombre_riesgo: values.nombre_riesgo,
				telefono_contacto: values.telefono_contacto,
				correo_contacto: values.correo_contacto ?? null,
				direccion: values.direccion,
				region: values.region,
				comuna: values.comuna,
				observaciones: values.observaciones ?? null,
				id_linea_negocio: values.id_linea_negocio,
				uf_por_metro_cuadrado: values.uf_por_metro_cuadrado ?? null,
				porcentaje_depreciacion: values.porcentaje_depreciacion
					? values.porcentaje_depreciacion / 100
					: null,
				porcentaje_espacios_comunes: values.porcentaje_espacios_comunes
					? values.porcentaje_espacios_comunes / 100
					: null,
				tiene_locales_comerciales: values.tiene_locales_comerciales ?? null,
				uso_del_condominio: values.uso_del_condominio ?? null,
				numero_pisos: values.numero_pisos ?? null,
				numero_torres: values.numero_torres ?? null,
				cantidad_departamentos: values.cantidad_departamentos ?? null,
				cantidad_subterraneos: values.cantidad_subterraneos ?? null,
				tiene_piscina: values.tiene_piscina ?? null,
				year_construccion: values.year_construccion ?? null,
				metros_cuadrados: values.metros_cuadrados ?? null,
			})
		},
		onSuccess: () => {
			console.log('success')
			queryClient.invalidateQueries({
				queryKey: ['prospecto', prospecto.id],
			})

			queryClient.invalidateQueries({
				queryKey: ['prospectos'],
			})
		},
	})

	const validationSchema = Yup.object({
		uf_por_metro_cuadrado: Yup.number()
			.min(0, 'Debe ingresar un número mayor a 0')
			.nullable(),
		porcentaje_depreciacion: Yup.number()
			.min(0, 'Debe ingresar un número entre 0 y 100')
			.max(100, 'Debe ingresar un número entre 0 y 100')
			.nullable(),
		porcentaje_espacios_comunes: Yup.number()
			.min(0, 'Debe ingresar un número entre 0 y 100')
			.max(100, 'Debe ingresar un número entre 0 y 100')
			.nullable(),
	})

	const formik = useFormik<FormularioInitialValues>({
		initialValues: {
			rut_riesgo: prospecto.rut_riesgo,
			nombre_riesgo: prospecto.nombre_riesgo,
			telefono_contacto: prospecto.telefono_contacto,
			correo_contacto: prospecto.correo_contacto,
			direccion: prospecto.direccion,
			region: prospecto.region,
			comuna: prospecto.comuna,
			observaciones: prospecto.observaciones,
			id_linea_negocio: prospecto.linea_negocio.id,
			tiene_locales_comerciales: prospecto.tiene_locales_comerciales,
			uso_del_condominio: prospecto.uso_del_condominio,
			materialidad: prospecto.materialidad,
			clasificacion_preliminar_incendio:
				prospecto.clasificacion_preliminar_incendio,
			procesos_productivos: prospecto.procesos_productivos,
			numero_pisos: prospecto.numero_pisos,
			numero_torres: prospecto.numero_torres,
			cantidad_departamentos: prospecto.cantidad_departamentos,
			cantidad_subterraneos: prospecto.cantidad_subterraneos,
			tiene_piscina: prospecto.tiene_piscina,
			ubicacion_piscina: prospecto.ubicacion_piscina,
			tiene_alarma_incencio: prospecto.tiene_alarma_incencio,
			tiene_sprinklers: prospecto.tiene_sprinklers,
			year_construccion: prospecto.year_construccion,
			metros_cuadrados: prospecto.metros_cuadrados,
			uf_por_metro_cuadrado: prospecto.uf_por_metro_cuadrado ?? undefined,
			porcentaje_depreciacion: prospecto.porcentaje_depreciacion
				? prospecto.porcentaje_depreciacion * 100
				: undefined,
			porcentaje_espacios_comunes: prospecto.porcentaje_espacios_comunes
				? prospecto.porcentaje_espacios_comunes * 100
				: undefined,
		},
		onSubmit: async values => {
			await mutation.mutateAsync(values)
			onComplete?.()
		},
		validationSchema,
	})

	return {
		formik,
		cargando: mutation.isPending,
	}
}
