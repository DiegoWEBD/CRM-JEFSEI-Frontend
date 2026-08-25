'use client'

import { actualizarPoliza } from '@/aplicacion/polizas/use-cases/actualizar-poliza/actualizar-poliza'
import { ActualizarPolizaRequest } from '@/aplicacion/polizas/use-cases/actualizar-poliza/dto/requests/actualizar-poliza-request'
import Poliza from '@/dominio/poliza/poliza'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export interface FieldsFormularioActualizarPoliza {
	tipo: 'nueva' | 'renovacion'
	prima_neta: number
	comision_corredora_pct: number
	fecha_emision: string
	inicio_vigencia: string
	fin_vigencia: string
	id_company: number
}

type UseFormularioActualizarPolizaProps = {
	poliza: Poliza
	onComplete?: () => void
}

export const useFormularioActualizarPoliza = ({
	poliza,
	onComplete,
}: UseFormularioActualizarPolizaProps) => {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (values: FieldsFormularioActualizarPoliza) => {
			const request: ActualizarPolizaRequest = {
				tipo: values.tipo,
				prima_neta: values.prima_neta,
				comision_corredora_pct: values.comision_corredora_pct / 100,
				fecha_emision: values.fecha_emision || null,
				inicio_vigencia: values.inicio_vigencia || null,
				fin_vigencia: values.fin_vigencia || null,
				id_company: values.id_company || null,
			}
			await actualizarPoliza(poliza.numero_poliza, request)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['poliza', poliza.numero_poliza],
			})
			queryClient.invalidateQueries({ queryKey: ['polizas'] })
		},
	})

	const validationSchema = Yup.object({
		tipo: Yup.string()
			.oneOf(['nueva', 'renovacion'], 'Selecciona un tipo')
			.required('El tipo es obligatorio'),
		prima_neta: Yup.number()
			.typeError('Ingresa un valor numérico')
			.positive('Debe ser mayor a 0')
			.required('La prima neta es obligatoria'),
		comision_corredora_pct: Yup.number()
			.typeError('Ingresa un valor numérico')
			.min(0, 'No puede ser negativo')
			.max(100, 'No puede ser mayor a 100')
			.required('El % de comisión es obligatorio'),
		fecha_emision: Yup.string().nullable(),
		inicio_vigencia: Yup.string().nullable(),
		fin_vigencia: Yup.string().nullable(),
		id_company: Yup.number()
			.typeError('Selecciona una compañía')
			.positive('Selecciona una compañía')
			.required('La compañía aseguradora es obligatoria'),
	})

	const formik = useFormik<FieldsFormularioActualizarPoliza>({
		initialValues: {
			tipo: poliza.tipo === 'renovacion' ? 'renovacion' : 'nueva',
			prima_neta: poliza.prima_neta,
			comision_corredora_pct: poliza.comision_corredora_pct,
			fecha_emision: poliza.fecha_emision
				? poliza.fecha_emision.split('T')[0]
				: '',
			inicio_vigencia: poliza.inicio_vigencia
				? poliza.inicio_vigencia.split('T')[0]
				: '',
			fin_vigencia: poliza.fin_vigencia
				? poliza.fin_vigencia.split('T')[0]
				: '',
			id_company: poliza.company?.id ?? 0,
		},
		validationSchema,
		onSubmit: async values => {
			await mutation.mutateAsync(values)
			onComplete?.()
		},
	})

	return {
		formik,
		cargando: mutation.isPending,
	}
}
