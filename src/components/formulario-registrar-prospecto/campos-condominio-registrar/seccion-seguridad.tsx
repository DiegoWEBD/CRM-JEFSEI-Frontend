import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import SiNoSelect from '@/components/forms/si-no-select/si-no-select'
import { FormikProps } from 'formik'

type Props = {
	formik: FormikProps<FormularioInitialValues>
}

export default function SeccionSeguridad({ formik }: Props) {
	return (
		<>
			<SiNoSelect
				label='Cuenta con alarma de incendio'
				value={formik.values.tiene_alarma_incendio}
				onChange={value =>
					formik.setFieldValue('tiene_alarma_incendio', value)
				}
			/>

			<SiNoSelect
				label='Cuenta con sprinklers'
				value={formik.values.tiene_sprinklers}
				onChange={value =>
					formik.setFieldValue('tiene_sprinklers', value)
				}
			/>
		</>
	)
}