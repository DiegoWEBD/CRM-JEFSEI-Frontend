import { actualizarProspectoEmpresa } from '@/aplicacion/prospectos/use-cases/actualizar-prospecto-empresa/actualizar-prospecto-empresa'
import { ActualizarProspectoEmpresaRequest } from '@/aplicacion/prospectos/use-cases/actualizar-prospecto-empresa/dto/requests/actualizar-prospecto-empresa-request'
import { ProspectoEmpresa } from '@/dominio/prospecto-empresa/prospecto-empresa'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'

type UseFormularioActualizarProspectoEmpresa = {
	prospecto: ProspectoEmpresa
	onComplete?: () => void
}

function n2(value: unknown): number | null {
	if (value === '' || value == null) return null
	return Number(value)
}

export const useFormularioActualizarProspectoEmpresa = ({
	prospecto,
	onComplete,
}: UseFormularioActualizarProspectoEmpresa) => {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (datos: ActualizarProspectoEmpresaRequest) => {
			await actualizarProspectoEmpresa(datos, prospecto.id)
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
		nombre_riesgo: Yup.string().required(
			'El nombre del prospecto es obligatorio',
		),
	})

	const formik = useFormik<ActualizarProspectoEmpresaRequest>({
		initialValues: {
			rut_riesgo: prospecto.rut_riesgo ?? '',
			nombre_riesgo: prospecto.nombre_riesgo,
			telefono_contacto: prospecto.telefono_contacto ?? '',
			correo_contacto: prospecto.correo_contacto ?? '',
			direccion: prospecto.direccion ?? '',
			region: prospecto.region ?? '',
			comuna: prospecto.comuna ?? '',
			observaciones: prospecto.observaciones ?? '',
			nombre_fantasia: prospecto.nombre_fantasia ?? '',
			cantidad_trabajadores: prospecto.cantidad_trabajadores || null,
			giros_comerciales: [...(prospecto.giros_comerciales ?? [])],
		},
		onSubmit: async values => {
			await mutation.mutateAsync({
				rut_riesgo: values.rut_riesgo === '' ? null : values.rut_riesgo,
				nombre_riesgo: values.nombre_riesgo,
				telefono_contacto:
					values.telefono_contacto === '' ? null : values.telefono_contacto,
				correo_contacto:
					values.correo_contacto === '' ? null : values.correo_contacto,
				direccion: values.direccion === '' ? null : values.direccion,
				region: values.region === '' ? null : values.region,
				comuna: values.comuna === '' ? null : values.comuna,
				observaciones:
					values.observaciones === '' ? null : values.observaciones,
				nombre_fantasia:
					values.nombre_fantasia === '' ? null : values.nombre_fantasia,
				cantidad_trabajadores: n2(values.cantidad_trabajadores),
				giros_comerciales: (values.giros_comerciales ?? []).filter(
					giro => giro.trim() !== '',
				),
			})
			onComplete?.()
		},
		validationSchema,
	})

	return {
		formik,
		cargando: mutation.isPending,
	}
}
