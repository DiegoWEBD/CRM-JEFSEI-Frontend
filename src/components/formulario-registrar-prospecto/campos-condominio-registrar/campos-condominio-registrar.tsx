import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import { ComponentType } from 'react'
import { FormikProps } from 'formik'
import SeccionConstruccion from './seccion-construccion'
import SeccionEvaluacion from './seccion-evaluacion'
import SeccionSeguridad from './seccion-seguridad'

export type CamposCondominioSection =
	| 'construccion'
	| 'evaluacion'
	| 'seguridad'

type Props = {
	formik: FormikProps<FormularioInitialValues>
	section: CamposCondominioSection
}

const SECCIONES: Record<
	CamposCondominioSection,
	ComponentType<{ formik: FormikProps<FormularioInitialValues> }>
> = {
	construccion: SeccionConstruccion,
	evaluacion: SeccionEvaluacion,
	seguridad: SeccionSeguridad,
}

export default function CamposCondominioRegistrar({ formik, section }: Props) {
	const ComponenteSeccion = SECCIONES[section]
	return <ComponenteSeccion formik={formik} />
}
