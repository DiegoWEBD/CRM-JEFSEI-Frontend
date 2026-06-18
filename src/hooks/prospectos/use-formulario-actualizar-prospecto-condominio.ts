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

function n2(value: unknown): number | null {
	if (value === '' || value == null) return null
	return Number(value)
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
				telefono_contacto: values.telefono_contacto ?? null,
				correo_contacto: values.correo_contacto ?? null,
				direccion: values.direccion ?? null,
				region: values.region ?? null,
				comuna: values.comuna ?? null,
				observaciones: values.observaciones ?? null,
				id_linea_negocio: values.id_linea_negocio,
				uf_por_metro_cuadrado: n2(values.uf_por_metro_cuadrado),
				porcentaje_depreciacion: values.porcentaje_depreciacion
					? values.porcentaje_depreciacion / 100
					: null,
				porcentaje_espacios_comunes: values.porcentaje_espacios_comunes
					? values.porcentaje_espacios_comunes / 100
					: null,
				tiene_locales_comerciales: values.tiene_locales_comerciales ?? null,
				uso_del_condominio: values.uso_del_condominio ?? null,
				materialidad: values.materialidad ?? null,
				clasificacion_preliminar_incendio:
					values.clasificacion_preliminar_incendio ?? null,
				procesos_productivos: values.procesos_productivos ?? null,
				numero_pisos: n2(values.numero_pisos),
				numero_torres: n2(values.numero_torres),
				cantidad_departamentos: n2(values.cantidad_departamentos),
				cantidad_subterraneos: n2(values.cantidad_subterraneos),
				tiene_piscina: values.tiene_piscina ?? null,
				ubicacion_piscina: values.ubicacion_piscina ?? null,
				tiene_alarma_incendio: values.tiene_alarma_incendio ?? null,
				tiene_sprinklers: values.tiene_sprinklers ?? null,
				year_construccion: n2(values.year_construccion),
				metros_cuadrados: n2(values.metros_cuadrados),
			})
		},
		onSuccess: () => {
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
			tiene_alarma_incendio: prospecto.tiene_alarma_incendio,
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
