'use client'

import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Skeleton } from '@/components/skeleton'
import { useObtenerProcesosComerciales } from '@/hooks/procesos-comerciales/use-obtener-procesos-comerciales'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import DialogNuevaOportunidad from './dialog-nueva-oportunidad/dialog-nueva-oportunidad'
import OportunidadItem from './oportunidad-item/oportunidad-item'

type CardOportunidadesComercialesProps = {
  idProspecto: number
  idCliente?: number
  informacionCompleta: boolean
  nombreCliente: string
  lineaNegocioNombre: string
  ejecutivoComercialRut?: string
  ejecutivoEvaluacionRut?: string
}

export default function CardOportunidadesComerciales({
  idProspecto,
  idCliente,
  informacionCompleta,
  nombreCliente,
  lineaNegocioNombre,
  ejecutivoComercialRut,
  ejecutivoEvaluacionRut,
}: CardOportunidadesComercialesProps) {
  const { data: procesos, isLoading } = useObtenerProcesosComerciales(idProspecto)
  const { usuario } = useUserSession()
  const [openNuevaOportunidad, setOpenNuevaOportunidad] = useState(false)

  return (
    <>
      <Card className='border-border bg-card shadow-none'>
        <CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
          <CardTitle className='min-w-0 text-sm font-semibold leading-tight tracking-tight text-foreground'>
            Oportunidades comerciales
          </CardTitle>
          {usuario?.rut === ejecutivoComercialRut ? (
            <Button
              type='button'
              size='sm'
              className='h-8 shrink-0 gap-1 text-xs shadow-none'
              onClick={() => setOpenNuevaOportunidad(true)}
            >
              <Plus className='h-3.5 w-3.5' aria-hidden />
              Nueva oportunidad
            </Button>
          ) : null}
        </CardHeader>

        <CardContent className='p-3 sm:p-4'>
          {isLoading ? (
            <div className='space-y-2'>
              <Skeleton className='h-11 w-full' />
              <Skeleton className='h-11 w-full' />
              <Skeleton className='h-11 w-full' />
            </div>
          ) : procesos && procesos.length > 0 ? (
            <div className='space-y-2'>
              {procesos.map((proceso) => (
                <OportunidadItem
                  key={proceso.id}
                  proceso={proceso}
                  idProspecto={idProspecto}
                  idCliente={idCliente}
                  informacionCompleta={informacionCompleta}
                  nombreCliente={nombreCliente}
                  lineaNegocioNombre={lineaNegocioNombre}
                  ejecutivoComercialRut={ejecutivoComercialRut}
                  ejecutivoEvaluacionRut={ejecutivoEvaluacionRut}
                />
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center gap-3 px-4 py-8 text-center'>
              <p className='max-w-md text-sm text-muted-foreground'>
                Aún no hay oportunidades comerciales para este cliente.
              </p>
              {usuario?.rut === ejecutivoComercialRut ? (
                <Button
                  type='button'
                  size='sm'
                  className='h-8 gap-1 text-xs shadow-none'
                  onClick={() => setOpenNuevaOportunidad(true)}
                >
                  <Plus className='h-3.5 w-3.5' aria-hidden />
                  Nueva oportunidad
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <DialogNuevaOportunidad
        open={openNuevaOportunidad}
        onOpenChange={setOpenNuevaOportunidad}
        idProspecto={idProspecto}
        lineaNegocioNombre={lineaNegocioNombre}
      />
    </>
  )
}
