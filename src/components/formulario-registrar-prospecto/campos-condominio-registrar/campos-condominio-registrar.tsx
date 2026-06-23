'use client'

import Campo from '@/components/forms/campo/campo'
import SiNoSelect from '@/components/forms/si-no-select/si-no-select'
import { Input } from '@/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {
  CLASIFICACION_PRELIMINAR_INCENDIO_LABELS,
  clasificacionPreliminarDesdeMaterialidad,
  ClasificacionPreliminarIncendio,
  MATERIALIDAD_PRINCIPAL_LABELS,
  MaterialidadPrincipalCondominio,
} from '@/lib/materialidades'
import {
  UBICACION_PISCINA_LABELS,
  UBICACION_PISCINA_OPCIONES_CON_PISCINA,
  UbicacionPiscinaCondominio,
} from '@/lib/ubicacion.piscina'
import { inputPendiente } from '@/utils/input/input-pendiente'
import { FormikProps } from 'formik'
import { useMemo } from 'react'

export type CamposCondominioSection =
  | 'construccion'
  | 'evaluacion'
  | 'seguridad'

type Props = {
  formik: FormikProps<any>
  section: CamposCondominioSection
}

const USO_CONDOMINIO_OPTIONS = [
  { value: 'habitacional', label: 'Habitacional' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'oficinas', label: 'Oficinas' },
  { value: 'habitacional_y_comercial', label: 'Habitacional y comercial' },
]

function inp(_pendiente: boolean, extra?: string) {
  return `h-9 text-sm shadow-none${extra ? ` ${extra}` : ''}`
}

function classPendienteLabel(pendiente: boolean) {
  return pendiente ? 'text-amber-800 dark:text-amber-200' : undefined
}

export default function CamposCondominioRegistrar({ formik, section }: Props) {
  const ubicacionPiscinaPendiente = useMemo(() => {
    if (formik.values.tiene_piscina === undefined || formik.values.tiene_piscina === null) return true
    if (!formik.values.tiene_piscina) return false
    if (formik.values.ubicacion_piscina === undefined || formik.values.ubicacion_piscina === '') return true
    return false
  }, [formik.values.tiene_piscina, formik.values.ubicacion_piscina])

  if (section === 'construccion') {
    return (
      <>
        <Campo
          label='Uso del condominio'
          labelClassName={classPendienteLabel(inputPendiente(formik.values.uso_del_condominio))}
        >
          <Select
            value={formik.values.uso_del_condominio || '__none__'}
            onValueChange={value =>
              formik.setFieldValue(
                'uso_del_condominio',
                value === '__none__' ? '' : value,
              )
            }
          >
            <SelectTrigger className={inp(inputPendiente(formik.values.uso_del_condominio))}>
              <SelectValue placeholder='Seleccionar uso' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='__none__' className='text-xs text-muted-foreground'>
                Seleccionar uso
              </SelectItem>
              {USO_CONDOMINIO_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className='text-xs'>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo
          label='Año de construcción'
          labelClassName={classPendienteLabel(inputPendiente(formik.values.year_construccion))}
        >
          <Input
            className={inp(inputPendiente(formik.values.year_construccion))}
            name='year_construccion'
            value={formik.values.year_construccion ?? ''}
            onChange={formik.handleChange}
            inputMode='numeric'
          />
        </Campo>

        <Campo
          label='Materialidad principal de construcción'
          labelClassName={classPendienteLabel(inputPendiente(formik.values.materialidad))}
        >
          <Select
            value={formik.values.materialidad || '__none__'}
            onValueChange={value => {
              const materialidad =
                value === '__none__' ? '' : (value as MaterialidadPrincipalCondominio)
              const clasificacionPreliminar =
                clasificacionPreliminarDesdeMaterialidad(materialidad)
              formik.setFieldValue('materialidad', materialidad)
              formik.setFieldValue(
                'clasificacion_preliminar_incendio',
                clasificacionPreliminar,
              )
            }}
          >
            <SelectTrigger className={inp(inputPendiente(formik.values.materialidad))}>
              <SelectValue placeholder='Seleccionar materialidad' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='__none__' className='text-xs text-muted-foreground'>
                Seleccionar materialidad
              </SelectItem>
              {(Object.keys(MATERIALIDAD_PRINCIPAL_LABELS) as MaterialidadPrincipalCondominio[]).map(
                key => (
                  <SelectItem key={key} value={key} className='text-xs'>
                    {MATERIALIDAD_PRINCIPAL_LABELS[key]}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </Campo>

        <Campo
          label='Clasificación preliminar incendio'
          labelClassName={classPendienteLabel(
            inputPendiente(formik.values.clasificacion_preliminar_incendio),
          )}
        >
          <Input
            readOnly
            disabled
            tabIndex={-1}
            className={`h-9 text-sm shadow-none cursor-default bg-muted/40 text-foreground opacity-100 w-fit${inp(inputPendiente(formik.values.clasificacion_preliminar_incendio))}`}
            value={
              formik.values.clasificacion_preliminar_incendio
                ? CLASIFICACION_PRELIMINAR_INCENDIO_LABELS[
                    formik.values
                      .clasificacion_preliminar_incendio as ClasificacionPreliminarIncendio
                  ]
                : '—'
            }
            aria-label='Clasificación preliminar incendio (calculada automáticamente)'
          />
          <p className='mt-1 text-[10px] leading-snug text-muted-foreground'>
            Valor preliminar según materialidad. La validación final corresponde a
            evaluación/proyectos.
          </p>
        </Campo>

        <SiNoSelect
          label='Cuenta con locales comerciales'
          value={formik.values.tiene_locales_comerciales}
          labelClassName={classPendienteLabel(
            inputPendiente(formik.values.tiene_locales_comerciales),
          )}
          triggerClassName={inp(inputPendiente(formik.values.tiene_locales_comerciales))}
          onChange={value => formik.setFieldValue('tiene_locales_comerciales', value)}
        />

        <SiNoSelect
          label='Procesos productivos'
          value={formik.values.procesos_productivos}
          labelClassName={classPendienteLabel(
            inputPendiente(formik.values.procesos_productivos),
          )}
          triggerClassName={inp(inputPendiente(formik.values.procesos_productivos))}
          onChange={value => formik.setFieldValue('procesos_productivos', value)}
        />
      </>
    )
  }

  if (section === 'evaluacion') {
    return (
      <>
        <Campo
          label='Total m² construidos'
          labelClassName={classPendienteLabel(inputPendiente(formik.values.metros_cuadrados))}
        >
          <Input
            className={inp(inputPendiente(formik.values.metros_cuadrados))}
            name='metros_cuadrados'
            value={formik.values.metros_cuadrados ?? ''}
            onChange={formik.handleChange}
            inputMode='decimal'
          />
        </Campo>

        <Campo
          label='Valor UF / m² con IVA'
          labelClassName={classPendienteLabel(
            inputPendiente(formik.values.uf_por_metro_cuadrado),
          )}
        >
          <Input
            className={inp(inputPendiente(formik.values.uf_por_metro_cuadrado))}
            name='uf_por_metro_cuadrado'
            value={formik.values.uf_por_metro_cuadrado ?? ''}
            onChange={formik.handleChange}
            inputMode='decimal'
          />
        </Campo>

        <Campo
          label='% depreciación'
          labelClassName={classPendienteLabel(
            inputPendiente(formik.values.porcentaje_depreciacion),
          )}
        >
          <Input
            className={inp(inputPendiente(formik.values.porcentaje_depreciacion))}
            name='porcentaje_depreciacion'
            value={formik.values.porcentaje_depreciacion ?? ''}
            onChange={formik.handleChange}
            inputMode='decimal'
          />
        </Campo>

        <Campo
          label='% espacios comunes'
          labelClassName={classPendienteLabel(
            inputPendiente(formik.values.porcentaje_espacios_comunes),
          )}
        >
          <Input
            className={inp(inputPendiente(formik.values.porcentaje_espacios_comunes))}
            name='porcentaje_espacios_comunes'
            value={formik.values.porcentaje_espacios_comunes ?? ''}
            onChange={formik.handleChange}
            inputMode='decimal'
          />
        </Campo>

        <Campo
          label='Número de pisos'
          labelClassName={classPendienteLabel(inputPendiente(formik.values.numero_pisos))}
        >
          <Input
            className={inp(inputPendiente(formik.values.numero_pisos))}
            name='numero_pisos'
            value={formik.values.numero_pisos ?? ''}
            onChange={formik.handleChange}
            inputMode='numeric'
          />
        </Campo>

        <Campo
          label='Número de torres'
          labelClassName={classPendienteLabel(inputPendiente(formik.values.numero_torres))}
        >
          <Input
            className={inp(inputPendiente(formik.values.numero_torres))}
            name='numero_torres'
            value={formik.values.numero_torres ?? ''}
            onChange={formik.handleChange}
            inputMode='numeric'
          />
        </Campo>

        <Campo
          label='Cantidad de departamentos'
          labelClassName={classPendienteLabel(
            inputPendiente(formik.values.cantidad_departamentos),
          )}
        >
          <Input
            className={inp(inputPendiente(formik.values.cantidad_departamentos))}
            name='cantidad_departamentos'
            value={formik.values.cantidad_departamentos ?? ''}
            onChange={formik.handleChange}
            inputMode='numeric'
          />
        </Campo>

        <Campo
          label='Cantidad de subterráneos'
          labelClassName={classPendienteLabel(
            inputPendiente(formik.values.cantidad_subterraneos),
          )}
        >
          <Input
            className={inp(inputPendiente(formik.values.cantidad_subterraneos))}
            name='cantidad_subterraneos'
            value={formik.values.cantidad_subterraneos ?? ''}
            onChange={formik.handleChange}
            inputMode='numeric'
          />
        </Campo>

        <SiNoSelect
          label='Cuenta con piscina'
          value={formik.values.tiene_piscina}
          labelClassName={classPendienteLabel(inputPendiente(formik.values.tiene_piscina))}
          triggerClassName={inp(inputPendiente(formik.values.tiene_piscina))}
          onChange={value => formik.setFieldValue('tiene_piscina', value)}
        />

        <Campo
          label='Ubicación de la piscina'
          labelClassName={classPendienteLabel(ubicacionPiscinaPendiente)}
        >
          <Select
            disabled={
              formik.values.tiene_piscina === undefined ||
              formik.values.tiene_piscina === null ||
              !formik.values.tiene_piscina
            }
            value={
              !formik.values.tiene_piscina
                ? 'no_aplica'
                : formik.values.ubicacion_piscina || '__none__'
            }
            onValueChange={value => {
              const v =
                value === '__none__'
                  ? undefined
                  : (value as UbicacionPiscinaCondominio)
              formik.setFieldValue('ubicacion_piscina', v)
            }}
          >
            <SelectTrigger
              className={`h-9 text-sm shadow-none${!formik.values.tiene_piscina ? ' cursor-not-allowed opacity-70' : ''}${ubicacionPiscinaPendiente ? ' border-amber-500/60 bg-amber-500/[0.06] dark:border-amber-500/50 dark:bg-amber-950/25' : ''}`}
            >
              <SelectValue placeholder='Seleccione' />
            </SelectTrigger>
            <SelectContent>
              {formik.values.tiene_piscina ? (
                <>
                  <SelectItem value='__none__' className='text-xs text-muted-foreground'>
                    Seleccione
                  </SelectItem>
                  {UBICACION_PISCINA_OPCIONES_CON_PISCINA.map(k => (
                    <SelectItem key={k} value={k} className='text-xs'>
                      {UBICACION_PISCINA_LABELS[k]}
                    </SelectItem>
                  ))}
                </>
              ) : (
                <SelectItem value='no_aplica' className='text-xs'>
                  {UBICACION_PISCINA_LABELS.no_aplica}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </Campo>
      </>
    )
  }

  return (
    <>
      <SiNoSelect
        label='Cuenta con alarma de incendio'
        value={formik.values.tiene_alarma_incendio}
        labelClassName={classPendienteLabel(
          inputPendiente(formik.values.tiene_alarma_incendio),
        )}
        triggerClassName={inp(inputPendiente(formik.values.tiene_alarma_incendio))}
        onChange={value => formik.setFieldValue('tiene_alarma_incendio', value)}
      />

      <SiNoSelect
        label='Cuenta con sprinklers'
        value={formik.values.tiene_sprinklers}
        labelClassName={classPendienteLabel(
          inputPendiente(formik.values.tiene_sprinklers),
        )}
        triggerClassName={inp(inputPendiente(formik.values.tiene_sprinklers))}
        onChange={value => formik.setFieldValue('tiene_sprinklers', value)}
      />
    </>
  )
}
