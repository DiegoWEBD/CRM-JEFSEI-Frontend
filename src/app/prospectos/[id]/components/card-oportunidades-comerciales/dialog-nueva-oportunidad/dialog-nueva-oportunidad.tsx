'use client'

import { Button } from '@/components/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog'
import { Label } from '@/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select'
import { Skeleton } from '@/components/skeleton'
import { useCrearProcesoComercial } from '@/hooks/procesos-comerciales/use-crear-proceso-comercial'
import { useProductosLineaNegocio } from '@/hooks/lineas-negocio/use-productos-linea-negocio'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type DialogNuevaOportunidadProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  idProspecto: number
  lineaNegocioId: number
  lineaNegocioNombre: string
}

export default function DialogNuevaOportunidad({
  open,
  onOpenChange,
  idProspecto,
  lineaNegocioId,
}: DialogNuevaOportunidadProps) {
  const [tipo, setTipo] = useState('')
  const mutation = useCrearProcesoComercial(idProspecto)
  const { data: productos, isLoading } = useProductosLineaNegocio(lineaNegocioId)

  async function handleSubmit() {
    if (!tipo) return
    try {
      await mutation.mutateAsync({ id_prospecto: idProspecto, tipo })
      toast.success('Oportunidad comercial creada')
      setTipo('')
      onOpenChange(false)
    } catch {
      toast.error('Error al crear oportunidad comercial')
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setTipo('')
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-sm gap-4'>
        <DialogHeader>
          <DialogTitle>Nueva oportunidad comercial</DialogTitle>
        </DialogHeader>

        <div className='space-y-1.5'>
          <Label className='text-xs'>Tipo de seguro</Label>
          {isLoading ? (
            <Skeleton className='h-9 w-full' />
          ) : (
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className='h-9 w-full text-sm'>
                <SelectValue placeholder='Seleccione tipo' />
              </SelectTrigger>
              <SelectContent>
                {productos?.map((p) => (
                  <SelectItem key={p.id} value={p.codigo ?? ''} className='text-sm'>
                    {p.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {mutation.isError && (
          <p className='text-xs font-medium text-destructive' role='alert'>
            {mutation.error instanceof Error ? mutation.error.message : 'Error al crear oportunidad'}
          </p>
        )}

        <DialogFooter className='gap-2'>
          <Button type='button' variant='outline' size='sm' onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type='button'
            size='sm'
            disabled={!tipo || mutation.isPending}
            onClick={handleSubmit}
          >
            {mutation.isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden />
            ) : null}
            Crear oportunidad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
