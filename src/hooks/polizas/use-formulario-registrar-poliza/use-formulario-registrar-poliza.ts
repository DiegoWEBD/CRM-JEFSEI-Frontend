'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import { FieldsFormularioRegistrarPoliza } from './dto/fields-formulario-registrar-poliza'

type UseFormularioRegistrarPolizaProps = {
  idProceso: number
  idProspecto: number
  idCliente?: number
  onClose?: () => void
}

export const useFormularioRegistrarPoliza = ({
  idProceso,
  idProspecto,
  idCliente,
  onClose,
}: UseFormularioRegistrarPolizaProps) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: FieldsFormularioRegistrarPoliza) => {
      const response = await axios.post(
        `/api/procesos-comerciales/${idProceso}/polizas`,
        {
          numero_poliza: values.numero_poliza.trim(),
          tipo: values.tipo,
          id_company: values.id_company,
          prima_neta: values.prima_neta,
          comision_corredora_pct: values.comision_corredora_pct,
          fecha_emision: values.fecha_emision,
          inicio_vigencia: values.inicio_vigencia,
          fin_vigencia: values.fin_vigencia,
        },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesos-comerciales', idProspecto] })
      if (idCliente) {
        queryClient.invalidateQueries({ queryKey: ['polizas', idCliente] })
      }
      onClose?.()
    },
  })

  const validationSchema = Yup.object({
    numero_poliza: Yup.string().required('El número de póliza es obligatorio'),
    id_company: Yup.number()
      .typeError('Selecciona una compañía')
      .positive('Selecciona una compañía')
      .required('La compañía aseguradora es obligatoria'),
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
      .required('El % de comisión es obligatorio'),
    fecha_emision: Yup.string().required('La fecha de emisión es obligatoria'),
    inicio_vigencia: Yup.string().required('La fecha de inicio es obligatoria'),
    fin_vigencia: Yup.string().required('La fecha de término es obligatoria'),
  })

  const formik = useFormik<FieldsFormularioRegistrarPoliza>({
    initialValues: {
      numero_poliza: '',
      id_company: 0,
      tipo: 'nueva',
      prima_neta: 0,
      comision_corredora_pct: 0,
      fecha_emision: '',
      inicio_vigencia: '',
      fin_vigencia: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await mutation.mutateAsync(values)
      resetForm()
    },
  })

  return {
    formik,
    cargando: mutation.isPending,
  }
}