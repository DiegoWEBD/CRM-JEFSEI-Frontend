'use client'

import { useFormik } from 'formik'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select'
import { Textarea } from '@/components/textarea'
import { useSolicitarCotizacion } from '@/hooks/solicitudes-cotizacion/use-solicitar-cotizacion'
import { useSolicitarCotizacionProceso } from '@/hooks/solicitudes-cotizacion/use-solicitar-cotizacion-proceso'
import type {
  LineaSeguroSolicitudKey,
  PrioridadSolicitud,
  TipoClienteSolicitudCotizacion,
} from '@/lib/solicitud-cotizacion-catalogo'
import {
  PRIORIDAD_SOLICITUD_LABELS,
  PRIORIDAD_SOLICITUD_OPCIONES,
  TIPO_CLIENTE_SOLICITUD_LABELS,
  camposSolicitudParaLinea,
  inferirTipoClienteSolicitud,
  lineasSolicitudParaTipo,
  lineaUsaActividadesAseguradas,
} from '@/lib/solicitud-cotizacion-catalogo'
import type { SolicitudCotizacionUnionRequest } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-cotizacion/dto/solicitud-cotizacion-union-request'

interface ActividadFila {
  actividad: string
  numero_asegurados: string
}

interface DialogNuevaSolicitudFormValues {
  lineaSeguro: LineaSeguroSolicitudKey | ''
  observaciones: string
  prioridad: PrioridadSolicitud
  monto_asegurado_total: string
  numero_guardias: string
  actividades: ActividadFila[]
  actividad_del_condominio: string
  limite: string
}

function valoresIniciales(tipo?: string): DialogNuevaSolicitudFormValues {
  return {
    lineaSeguro: (tipo as LineaSeguroSolicitudKey) ?? '',
    observaciones: '',
    prioridad: 'normal',
    monto_asegurado_total: '',
    numero_guardias: '',
    actividades: [{ actividad: '', numero_asegurados: '' }],
    actividad_del_condominio: '',
    limite: '',
  }
}

function nuevaActividadFila(): ActividadFila {
  return { actividad: '', numero_asegurados: '' }
}

type DialogNuevaSolicitudCotizacionProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  idProspecto: number
  nombreCliente: string
  lineaNegocioNombre: string
  tipoPredefinido?: string
  idProceso?: number
}

export default function DialogNuevaSolicitudCotizacion({
  open,
  onOpenChange,
  idProspecto,
  nombreCliente,
  lineaNegocioNombre,
  tipoPredefinido,
  idProceso,
}: DialogNuevaSolicitudCotizacionProps) {
  const tipoCliente = inferirTipoClienteSolicitud(lineaNegocioNombre)
  const mutation = useSolicitarCotizacion(idProspecto)
  const mutationProceso = useSolicitarCotizacionProceso(idProceso ?? 0)

  const lineasOpciones = lineasSolicitudParaTipo(tipoCliente)

  function validar(values: DialogNuevaSolicitudFormValues) {
    const errors: Record<string, string> = {}
    if (!tipoPredefinido && !values.lineaSeguro) {
      errors.lineaSeguro = 'Debe seleccionar una línea de seguro'
    }
    const campos = camposSolicitudParaLinea(tipoCliente, values.lineaSeguro)
    for (const campo of campos) {
      if (campo.tipo === 'actividades_aseguradas') {
        for (let i = 0; i < values.actividades.length; i++) {
          const a = values.actividades[i]
          if (!a.actividad.trim()) {
            errors[`actividades.${i}.actividad`] = 'Requerido'
          }
          if (!a.numero_asegurados.trim() || Number(a.numero_asegurados) < 1) {
            errors[`actividades.${i}.numero_asegurados`] = 'Debe ser >= 1'
          }
        }
      } else if (campo.required) {
        const val = values[campo.key as keyof DialogNuevaSolicitudFormValues]
        if (typeof val === 'string' && !val.trim()) {
          errors[campo.key] = `Campo requerido`
        }
      }
    }
    return errors
  }

  function transformarARequest(
    values: DialogNuevaSolicitudFormValues,
  ): SolicitudCotizacionUnionRequest {
    const base = {
      id_prospecto: idProspecto,
      prioridad: values.prioridad,
      observaciones: values.observaciones || null,
      motivo_recotizacion: null,
      id_solicitud_previa: null,
    }

    const tipo = values.lineaSeguro

    if (tipo === 'unidades') {
      return {
        ...base,
        tipo,
        monto_asegurado_total: Number(values.monto_asegurado_total),
        nombre_excel: '',
      }
    }

    if (tipo === 'vida_guardia') {
      return {
        ...base,
        tipo,
        numero_guardias: Number(values.numero_guardias),
      }
    }

    if (tipo === 'accidentes_personales') {
      return {
        ...base,
        tipo,
        actividades: values.actividades.map((a) => ({
          actividad: a.actividad,
          numero_asegurados: Number(a.numero_asegurados),
        })),
      }
    }

    if (tipo === 'rc_condominio') {
      return {
        ...base,
        tipo,
        actividad_del_condominio: values.actividad_del_condominio,
        limite: Number(values.limite),
      }
    }

    return {
      ...base,
      tipo: tipo as 'vehiculos' | 'hogar' | 'vida' | 'salud_complementario' | 'mascotas' | 'espacios_comunes',
    }
  }

  function reiniciarCamposDinamicos(setFieldValue: (field: string, value: unknown) => void) {
    setFieldValue('monto_asegurado_total', '')
    setFieldValue('numero_guardias', '')
    setFieldValue('actividades', [nuevaActividadFila()])
    setFieldValue('actividad_del_condominio', '')
    setFieldValue('limite', '')
  }

  const formik = useFormik({
    initialValues: valoresIniciales(tipoPredefinido),
    validate: validar,
    onSubmit: async (values) => {
      const request = transformarARequest(values)
      if (idProceso) {
        await mutationProceso.mutateAsync(request)
      } else {
        await mutation.mutateAsync(request)
      }
      onOpenChange(false)
    },
    enableReinitialize: false,
  })

  const lineaActual: LineaSeguroSolicitudKey | '' = (tipoPredefinido as LineaSeguroSolicitudKey) ?? formik.values.lineaSeguro
  const camposDinamicos = camposSolicitudParaLinea(tipoCliente, lineaActual)
  const camposEstandar = camposDinamicos.filter((c) => c.tipo !== 'actividades_aseguradas')
  const esAccidentesPersonales = lineaUsaActividadesAseguradas(tipoCliente, lineaActual)

  function handleLineaChange(value: string) {
    if (tipoPredefinido) return
    formik.setFieldValue('lineaSeguro', value)
    reiniciarCamposDinamicos(formik.setFieldValue)
  }

  function handleAddActividad() {
    formik.setFieldValue('actividades', [...formik.values.actividades, nuevaActividadFila()])
  }

  function handleRemoveActividad(index: number) {
    const nuevas = formik.values.actividades.filter((_, i) => i !== index)
    formik.setFieldValue('actividades', nuevas.length === 0 ? [nuevaActividadFila()] : nuevas)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[min(90vh,720px)] max-w-md gap-4 overflow-y-auto'>
        <DialogHeader className='space-y-0'>
          <DialogTitle>Solicitud de cotización</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className='space-y-3'>
          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>Cliente</Label>
            <p className='rounded-md border border-border bg-muted/15 px-3 py-2 text-sm font-medium text-foreground'>
              {nombreCliente.trim() || '—'}
            </p>
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs'>Tipo de cliente</Label>
            <p className='rounded-md border border-border bg-muted/15 px-3 py-2 text-sm font-medium text-foreground'>
              {TIPO_CLIENTE_SOLICITUD_LABELS[tipoCliente]}
            </p>
          </div>

          {!tipoPredefinido && (
            <div className='space-y-1.5'>
              <Label className='text-xs'>Línea de seguro</Label>
              <Select
                value={formik.values.lineaSeguro || '__none__'}
                onValueChange={handleLineaChange}
              >
                <SelectTrigger className='h-9 w-full text-sm'>
                  <SelectValue placeholder='Seleccione línea de seguro' />
                </SelectTrigger>
                <SelectContent>
                  {lineasOpciones.map((l) => (
                    <SelectItem key={l.key} value={l.key} className='text-sm'>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.errors.lineaSeguro && formik.touched.lineaSeguro && (
                <p className='text-xs font-medium text-destructive'>{formik.errors.lineaSeguro}</p>
              )}
            </div>
          )}

          {esAccidentesPersonales ? (
            <div className='space-y-2 rounded-md border border-border/70 bg-muted/10 p-3'>
              <div className='flex items-center justify-between'>
                <p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
                  Actividades aseguradas
                </p>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='h-7 gap-1 text-xs shadow-none'
                  onClick={handleAddActividad}
                >
                  <Plus className='h-3 w-3' aria-hidden />
                  Agregar
                </Button>
              </div>

              <div className='space-y-2'>
                {formik.values.actividades.map((act, index) => (
                  <div key={index} className='flex items-start gap-2'>
                    <div className='flex flex-1 flex-col gap-1'>
                      <Input
                        type='text'
                        className='h-8 text-xs'
                        placeholder='Actividad'
                        value={act.actividad}
                        onChange={(e) =>
                          formik.setFieldValue(`actividades.${index}.actividad`, e.target.value)
                        }
                      />
                      {formik.errors[`actividades.${index}.actividad` as keyof typeof formik.errors] && (
                        <p className='text-[10px] font-medium text-destructive'>
                          {formik.errors[`actividades.${index}.actividad` as keyof typeof formik.errors] as string}
                        </p>
                      )}
                    </div>
                    <div className='flex flex-1 flex-col gap-1'>
                      <Input
                        type='number'
                        min={1}
                        className='h-8 text-xs'
                        placeholder='N° asegurados'
                        value={act.numero_asegurados}
                        onChange={(e) =>
                          formik.setFieldValue(`actividades.${index}.numero_asegurados`, e.target.value)
                        }
                      />
                      {formik.errors[`actividades.${index}.numero_asegurados` as keyof typeof formik.errors] && (
                        <p className='text-[10px] font-medium text-destructive'>
                          {formik.errors[`actividades.${index}.numero_asegurados` as keyof typeof formik.errors] as string}
                        </p>
                      )}
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon-sm'
                      className='mt-0.5 shrink-0 text-muted-foreground hover:text-destructive'
                      onClick={() => handleRemoveActividad(index)}
                      disabled={formik.values.actividades.length <= 1}
                    >
                      <Trash2 className='h-3.5 w-3.5' aria-hidden />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {camposEstandar.length > 0 ? (
            <div className='space-y-3 rounded-md border border-border/70 bg-muted/10 p-3'>
              <p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
                Datos de la línea
              </p>
              {camposEstandar.map((campo) => {
                const fieldKey = campo.key as keyof DialogNuevaSolicitudFormValues
                return (
                  <div key={campo.key} className='space-y-1.5'>
                    <Label className='text-xs'>
                      {campo.label}
                      {campo.required ? ' *' : ''}
                    </Label>
                    <Input
                      type={campo.tipo === 'number' ? 'number' : 'text'}
                      min={campo.tipo === 'number' ? 1 : undefined}
                      className='h-9 text-sm'
                      placeholder={campo.placeholder}
                      value={formik.values[fieldKey] as string}
                      onChange={formik.handleChange}
                      name={campo.key}
                    />
                    {formik.errors[fieldKey] && formik.touched[fieldKey] && (
                      <p className='text-xs font-medium text-destructive'>
                        {formik.errors[fieldKey] as string}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : null}

          <div className='space-y-1.5'>
            <Label className='text-xs text-muted-foreground'>Observaciones (opcional)</Label>
            <Textarea
              className='min-h-[72px] resize-y text-sm'
              value={formik.values.observaciones}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name='observaciones'
              placeholder='Indicación breve para la solicitud…'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs'>Prioridad de solicitud</Label>
            <Select
              value={formik.values.prioridad}
              onValueChange={(v) => formik.setFieldValue('prioridad', v)}
            >
              <SelectTrigger className='h-9 w-full text-sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORIDAD_SOLICITUD_OPCIONES.map((p) => (
                  <SelectItem key={p} value={p} className='text-sm'>
                    {PRIORIDAD_SOLICITUD_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mutation.isError && (
            <p className='text-xs font-medium text-destructive' role='alert'>
              {mutation.error instanceof Error ? mutation.error.message : 'Error al guardar solicitud'}
            </p>
          )}

          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              size='sm'
              disabled={formik.isSubmitting || (!tipoPredefinido && !formik.values.lineaSeguro)}
            >
              {formik.isSubmitting ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden />
              ) : null}
              Guardar solicitud
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
