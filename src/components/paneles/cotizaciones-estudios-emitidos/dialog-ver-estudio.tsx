'use client'

import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog'
import { Button } from '@/components/button'
import { useListarEstudiosComerciales } from '@/hooks/estudio-comercial/use-listar-estudios-comerciales'
import { Skeleton } from '@/components/skeleton'
import { FileText, Download } from 'lucide-react'

type DialogVerEstudioProps = {
  fila: PanelEstudioFila
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogVerEstudio({
  fila,
  open,
  onOpenChange,
}: DialogVerEstudioProps) {
  const { data: estudios, isLoading } = useListarEstudiosComerciales(
    fila.id,
  )

  const estudio = estudios && estudios.length > 0 ? estudios[0] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-base'>Ver estudio</DialogTitle>
          <DialogDescription>
            {fila.cliente} · {fila.linea_seguro}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='space-y-3 py-4'>
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-40' />
          </div>
        ) : estudio ? (
          <div className='space-y-3 text-sm'>
            <p className='text-xs text-muted-foreground'>
              Documento armado por evaluación/proyectos para el ejecutivo
              comercial. Las cotizaciones de las aseguradoras están en «Ver
              opciones».
            </p>
            <div className='rounded-md border border-border/80 bg-muted/20 p-3 text-xs'>
              <dt className='text-muted-foreground'>Archivo</dt>
              <dd className='mt-0.5 flex items-center gap-2 font-medium'>
                <FileText className='size-3.5 shrink-0 text-muted-foreground' />
                <span className='truncate'>
                  {estudio.nombre_archivo || 'estudio_comercial.pdf'}
                </span>
              </dd>
            </div>

            <Button
              variant='outline'
              size='sm'
              className='h-8 text-xs'
              onClick={() => {
                window.open(
                  `/api/solicitudes-cotizacion/${fila.id}/estudios-comerciales/${estudio.id}/archivo`,
                  '_blank',
                )
              }}
            >
              <Download className='mr-2 h-4 w-4' />
              Descargar estudio
            </Button>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>
            No se encontró el estudio.
          </p>
        )}

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
