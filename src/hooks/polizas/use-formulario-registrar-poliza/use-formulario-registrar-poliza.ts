import { useFormik } from 'formik'
import { FieldsFormularioRegistrarPoliza } from './dto/fields-formulario-registrar-poliza'

export const useFormularioRegistrarPoliza = () => {
	const formik = useFormik<FieldsFormularioRegistrarPoliza>({
		initialValues: {
			numero_poliza: undefined,
			id_company: undefined,
			id_proceso_comercial: undefined,
			fecha_emision: undefined,
			inicio_vigencia: undefined,
			fin_vigencia: undefined,
			prima_neta: undefined,
		},
		onSubmit: values => {
			console.log(values)
		},
	})

	return { formik }
}
