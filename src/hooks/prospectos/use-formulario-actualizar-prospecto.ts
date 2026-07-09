import { actualizarProspecto } from '@/aplicacion/prospectos/use-cases/actualizar-prospecto/actualizar-prospecto'
import { ActualizarProspectoRequest } from '@/aplicacion/prospectos/use-cases/actualizar-prospecto/dto/requests/actualizar-prospecto-request'
import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'

type UseFormularioActualizarProspecto = {
	prospecto: Prospecto
	onComplete?: () => void
}

export const useFormularioActualizarProspecto = ({
	prospecto,
	onComplete,
}: UseFormularioActualizarProspecto) => {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (datos: ActualizarProspectoRequest) => {
			await actualizarProspecto(prospecto.id, datos)
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
			linea_negocio: prospecto.linea_negocio.nombre?.toLowerCase() || 'lineas_personales',
		},
		onSubmit: async values => {
			await mutation.mutateAsync({
				rut_riesgo: values.rut_riesgo === '' ? null : (values.rut_riesgo ?? null),
				nombre_riesgo: values.nombre_riesgo,
				telefono_contacto: values.telefono_contacto === '' ? null : (values.telefono_contacto ?? null),
				correo_contacto: values.correo_contacto === '' ? null : (values.correo_contacto ?? null),
				direccion: values.direccion === '' ? null : (values.direccion ?? null),
				region: values.region === '' ? null : (values.region ?? null),
				comuna: values.comuna === '' ? null : (values.comuna ?? null),
				observaciones: values.observaciones === '' ? null : (values.observaciones ?? null),
			})
			onComplete?.()
		},
	})

	return {
		formik,
		cargando: mutation.isPending,
	}
}
