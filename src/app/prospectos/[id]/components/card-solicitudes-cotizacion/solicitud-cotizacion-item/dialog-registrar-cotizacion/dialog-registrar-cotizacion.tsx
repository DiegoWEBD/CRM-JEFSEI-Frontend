'use client'

import { useFormik } from 'formik'
import { Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { useCompaniesSeguros } from '@/hooks/companies-seguros/use-companies-seguros'
import { useRegistrarCotizacion } from '@/hooks/cotizaciones/use-registrar-cotizacion'
import type { RegistrarCotizacionRequest } from '@/aplicacion/cotizaciones/use-cases/registrar-cotizacion/dto/registrar-cotizacion-request'

type DialogRegistrarCotizacionProps = {
  solicitudId: number
  idProspecto: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

type FormValues = {
  id_company: string
  monto_total_asegurado: string
  tasa_afecta: string
  tasa_excenta: string
  tasa_politica: string
  prima_adicional_asistencia: string
  fecha_emision: string
  fecha_vencimiento: string
  archivo: File | null
}

const initialValues: FormValues = {
  id_company: '',
  monto_total_asegurado: '',
  tasa_afecta: '',
  tasa_excenta: '',
  tasa_politica: '',
  prima_adicional_asistencia: '',
  fecha_emision: '',
  fecha_vencimiento: '',
  archivo: null,
}

function transformarARequest(values: FormValues): RegistrarCotizacionRequest {
  return {
    id_company: Number(values.id_company),
    monto_total_asegurado: Number(values.monto_total_asegurado),
    tasa_afecta: Number(values.tasa_afecta),
    tasa_excenta: Number(values.tasa_excenta),
    tasa_politica: Number(values.tasa_politica),
    prima_adicional_asistencia: Number(values.prima_adicional_asistencia),
    fecha_emision: values.fecha_emision,
    fecha_vencimiento: values.fecha_vencimiento,
    archivo: values.archivo ?? undefined,
  }
}

export default function DialogRegistrarCotizacion({
  solicitudId,
  idProspecto,
  open,
  onOpenChange,
}: DialogRegistrarCotizacionProps) {
  const archivoInputRef = useRef<HTMLInputElement>(null)
  const { data: companies, isLoading: loadingCompanies } = useCompaniesSeguros()
  const mutation = useRegistrarCotizacion(solicitudId, idProspecto)

  const formik = useFormik({
    initialValues,
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.id_company) errors.id_company = 'Seleccione una compañía'
      if (values.monto_total_asegurado === '' || Number(values.monto_total_asegurado) <= 0) errors.monto_total_asegurado = 'Debe ser mayor a cero'
      if (values.tasa_afecta === '' || Number(values.tasa_afecta) < 0) errors.tasa_afecta = 'No puede ser negativo'
      if (values.tasa_excenta === '' || Number(values.tasa_excenta) < 0) errors.tasa_excenta = 'No puede ser negativo'
      if (values.tasa_politica === '' || Number(values.tasa_politica) < 0) errors.tasa_politica = 'No puede ser negativo'
      if (values.prima_adicional_asistencia === '' || Number(values.prima_adicional_asistencia) < 0) errors.prima_adicional_asistencia = 'No puede ser negativo'
      if (!values.fecha_emision) errors.fecha_emision = 'Requerido'
      if (!values.fecha_vencimiento) errors.fecha_vencimiento = 'Requerido'
      return errors
    },
    onSubmit: async (values) => {
      const request = transformarARequest(values)
      await mutation.mutateAsync(request)
      formik.resetForm()
      onOpenChange(false)
    },
    enableReinitialize: false,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-md gap-4 overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Registrar cotización recibida</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className='space-y-3'>
          <div className='space-y-1.5'>
            <Label className='text-xs'>Compañía aseguradora</Label>
            <Select
              value={formik.values.id_company || '__none__'}
              onValueChange={(v) => formik.setFieldValue('id_company', v === '__none__' ? '' : v)}
              disabled={loadingCompanies}
            >
              <SelectTrigger className='h-9 w-full text-sm'>
                <SelectValue placeholder={loadingCompanies ? 'Cargando…' : 'Seleccionar compañía'} />
              </SelectTrigger>
              <SelectContent>
                {companies?.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)} className='text-sm'>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.errors.id_company && formik.touched.id_company && (
              <p className='text-xs text-destructive'>{formik.errors.id_company}</p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs'>Monto total asegurado (UF)</Label>
            <Input
              type='number'
              min={0}
              step='0.01'
              className='h-9 text-sm shadow-none'
              placeholder='0'
              {...formik.getFieldProps('monto_total_asegurado')}
            />
            {formik.errors.monto_total_asegurado && formik.touched.monto_total_asegurado && (
              <p className='text-xs text-destructive'>{formik.errors.monto_total_asegurado}</p>
            )}
          </div>

          <div className='grid gap-3 sm:grid-cols-3'>
            <div className='space-y-1.5'>
              <Label className='text-xs'>Tasa afecta</Label>
              <Input
                type='number'
                min={0}
                step='0.01'
                className='h-9 text-sm shadow-none'
                {...formik.getFieldProps('tasa_afecta')}
              />
              {formik.errors.tasa_afecta && formik.touched.tasa_afecta && (
                <p className='text-xs text-destructive'>{formik.errors.tasa_afecta}</p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label className='text-xs'>Tasa excenta</Label>
              <Input
                type='number'
                min={0}
                step='0.01'
                className='h-9 text-sm shadow-none'
                {...formik.getFieldProps('tasa_excenta')}
              />
              {formik.errors.tasa_excenta && formik.touched.tasa_excenta && (
                <p className='text-xs text-destructive'>{formik.errors.tasa_excenta}</p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label className='text-xs'>Tasa política</Label>
              <Input
                type='number'
                min={0}
                step='0.01'
                className='h-9 text-sm shadow-none'
                {...formik.getFieldProps('tasa_politica')}
              />
              {formik.errors.tasa_politica && formik.touched.tasa_politica && (
                <p className='text-xs text-destructive'>{formik.errors.tasa_politica}</p>
              )}
            </div>
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs'>Prima adicional asistencia (UF)</Label>
            <Input
              type='number'
              min={0}
              step='0.01'
              className='h-9 text-sm shadow-none'
              {...formik.getFieldProps('prima_adicional_asistencia')}
            />
            {formik.errors.prima_adicional_asistencia && formik.touched.prima_adicional_asistencia && (
              <p className='text-xs text-destructive'>{formik.errors.prima_adicional_asistencia}</p>
            )}
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label className='text-xs'>Fecha de emisión</Label>
              <Input type='date' className='h-9 text-sm shadow-none' {...formik.getFieldProps('fecha_emision')} />
              {formik.errors.fecha_emision && formik.touched.fecha_emision && (
                <p className='text-xs text-destructive'>{formik.errors.fecha_emision}</p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label className='text-xs'>Fecha de vencimiento</Label>
              <Input type='date' className='h-9 text-sm shadow-none' {...formik.getFieldProps('fecha_vencimiento')} />
              {formik.errors.fecha_vencimiento && formik.touched.fecha_vencimiento && (
                <p className='text-xs text-destructive'>{formik.errors.fecha_vencimiento}</p>
              )}
            </div>
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs'>Archivo cotización (PDF)</Label>
            <input
              ref={archivoInputRef}
              type='file'
              accept='.pdf,application/pdf'
              className='sr-only'
              onChange={(e) =>
                formik.setFieldValue('archivo', e.target.files?.[0] ?? null)
              }
            />
            {formik.values.archivo ? (
              <div className='flex items-center gap-2 rounded-md border border-border px-3 py-2'>
                <Upload className='h-3.5 w-3.5 shrink-0 text-muted-foreground' />
                <span className='flex-1 truncate text-xs'>
                  {formik.values.archivo.name}
                </span>
                <button
                  type='button'
                  className='shrink-0 text-muted-foreground hover:text-foreground'
                  onClick={() => {
                    formik.setFieldValue('archivo', null)
                    if (archivoInputRef.current) archivoInputRef.current.value = ''
                  }}
                >
                  <X className='h-3.5 w-3.5' />
                </button>
              </div>
            ) : (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => archivoInputRef.current?.click()}
              >
                <Upload className='mr-1.5 h-3.5 w-3.5' />
                Elegir PDF
              </Button>
            )}
          </div>

          {mutation.isError && (
            <p className='text-xs text-destructive' role='alert'>
              {mutation.error instanceof Error ? mutation.error.message : 'Error al guardar cotización'}
            </p>
          )}

          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => onOpenChange(false)}
              disabled={formik.isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              size='sm'
              disabled={formik.isSubmitting || !formik.values.id_company}
            >
              {formik.isSubmitting ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden />
              ) : null}
              Guardar cotización
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
