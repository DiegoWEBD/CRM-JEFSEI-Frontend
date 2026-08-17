'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { useMemo } from 'react'

import { Button } from '@/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog'
import Input from '@/components/forms/input/input'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import Textarea from '@/components/forms/text-area/text-area'
import { useRegistrarRecordatorio } from '@/hooks/recordatorios/use-registrar-recordatorio'
import { useActualizarRecordatorio } from '@/hooks/recordatorios/use-actualizar-recordatorio'
import { formatearFecha } from '@/utils/formatear-fecha'
import type { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import type Recordatorio from '@/dominio/recordatorio/recordatorio'

type DialogCrearRecordatorioProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  prospectos?: ProspectoResumenJson[]
  idProspectoInicial?: number
  editarRecordatorio?: Recordatorio | null
}

export default function DialogCrearRecordatorio({
  open,
  onOpenChange,
  prospectos,
  idProspectoInicial,
  editarRecordatorio,
}: DialogCrearRecordatorioProps) {
  const esEdicion = !!editarRecordatorio
  const crearMutation = useRegistrarRecordatorio()
  const actualizarMutation = useActualizarRecordatorio(editarRecordatorio?.id ?? 0)
  const hoyIso = useMemo(() => formatearFecha(new Date(), 'yyyy-MM-dd'), [])

  function parsearInitialValues() {
    if (editarRecordatorio) {
      const fecha = formatearFecha(
        new Date(editarRecordatorio.fecha_recordatorio),
        'yyyy-MM-dd',
      )
      const hora = formatearFecha(
        new Date(editarRecordatorio.fecha_recordatorio),
        'HH:mm',
      )
      return {
        idProspecto: editarRecordatorio.id_prospecto?.toString() ?? '',
        titulo: editarRecordatorio.titulo,
        fecha,
        hora,
        prioridad: editarRecordatorio.prioridad,
        tipoGestion: editarRecordatorio.tipo_gestion,
        detalle: editarRecordatorio.detalle ?? '',
      }
    }
    return {
      idProspecto: idProspectoInicial?.toString() ?? '',
      titulo: '',
      fecha: hoyIso,
      hora: '09:00',
      prioridad: 'normal',
      tipoGestion: 'llamada',
      detalle: '',
    }
  }

  const formik = useFormik({
    initialValues: parsearInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      titulo: Yup.string().required('El tÃ­tulo es obligatorio'),
      fecha: Yup.string().required('La fecha es obligatoria'),
      hora: Yup.string().required('La hora es obligatoria'),
      prioridad: Yup.string()
        .oneOf(['normal', 'alta'], 'Selecciona una prioridad')
        .required(),
      tipoGestion: Yup.string()
        .oneOf(
          ['llamada', 'correo', 'visita', 'whatsapp', 'reunion', 'otro'],
          'Selecciona un tipo',
        )
        .required(),
    }),
    onSubmit: (values) => {
      const fechaRecordatorio = new Date(`${values.fecha}T${values.hora}:00`).toISOString()

      if (esEdicion) {
        actualizarMutation.mutate(
          {
            titulo: values.titulo,
            detalle: values.detalle || null,
            prioridad: values.prioridad,
            tipo_gestion: values.tipoGestion,
            fecha_recordatorio: fechaRecordatorio,
            id_prospecto: values.idProspecto
              ? Number(values.idProspecto)
              : null,
          },
          {
            onSuccess: () => {
              onOpenChange(false)
              toast.success('Recordatorio actualizado')
            },
          },
        )
      } else {
        crearMutation.mutate(
          {
            titulo: values.titulo,
            detalle: values.detalle || null,
            prioridad: values.prioridad,
            tipo_gestion: values.tipoGestion,
            fecha_recordatorio: fechaRecordatorio,
            id_prospecto: values.idProspecto
              ? Number(values.idProspecto)
              : null,
          },
          {
            onSuccess: () => {
              onOpenChange(false)
              toast.success('Recordatorio creado')
            },
          },
        )
      }
    },
  })

  function handleOpenChange(open: boolean) {
    if (open) {
      formik.resetForm({ values: parsearInitialValues() })
    }
    onOpenChange(open)
  }

  if (!open && editarRecordatorio) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {esEdicion ? 'Editar recordatorio' : 'Crear recordatorio'}
          </DialogTitle>
          <DialogDescription>
            {esEdicion
              ? 'Modifica los datos del recordatorio.'
              : 'Asocia recordatorios comerciales al calendario del dÃ­a.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className='space-y-3'>
            {prospectos ? (
              <Select
                value={formik.values.idProspecto}
                onValueChange={(v) =>
                  formik.setFieldValue('idProspecto', v)
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Cliente asociado (opcional)' />
                </SelectTrigger>
                <SelectContent>
                  {prospectos.map((prospecto) => (
                    <SelectItem
                      key={prospecto.id}
                      value={prospecto.id.toString()}
                    >
                      {prospecto.nombre_riesgo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            <Input
              placeholder='TÃ­tulo'
              name='titulo'
              value={formik.values.titulo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.titulo && formik.errors.titulo && (
              <p className='text-xs text-destructive'>
                {formik.errors.titulo}
              </p>
            )}

            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              <Input
                type='date'
                name='fecha'
                value={formik.values.fecha}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Input
                type='time'
                name='hora'
                value={formik.values.hora}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              <Select
                value={formik.values.prioridad}
                onValueChange={(v) =>
                  formik.setFieldValue('prioridad', v)
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Prioridad' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='normal'>Normal</SelectItem>
                  <SelectItem value='alta'>Alta</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={formik.values.tipoGestion}
                onValueChange={(v) =>
                  formik.setFieldValue('tipoGestion', v)
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Tipo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='llamada'>Llamada</SelectItem>
                  <SelectItem value='correo'>Correo</SelectItem>
                  <SelectItem value='whatsapp'>Mensaje</SelectItem>
                  <SelectItem value='visita'>Visita</SelectItem>
                  <SelectItem value='reunion'>ReuniÃ³n</SelectItem>
                  <SelectItem value='otro'>General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder='Detalle (opcional)'
              name='detalle'
              value={formik.values.detalle}
              onChange={formik.handleChange}
            />
          </div>

          <DialogFooter className='mt-4'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' size='sm' disabled={crearMutation.isPending || actualizarMutation.isPending}>
              {crearMutation.isPending || actualizarMutation.isPending
                ? 'Guardandoâ€¦'
                : esEdicion
                  ? 'Actualizar'
                  : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
