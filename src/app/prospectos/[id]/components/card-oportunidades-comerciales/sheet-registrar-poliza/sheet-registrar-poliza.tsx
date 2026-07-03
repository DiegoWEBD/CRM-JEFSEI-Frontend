'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/button'
import { Label } from '@/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { Input } from '@/components/input'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/sheet'
import { useCompaniesSeguros } from '@/hooks/companies-seguros/use-companies-seguros'
import { toast } from 'sonner'
import axios from 'axios'

type SheetRegistrarPolizaProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  idProceso: number
  idProspecto: number
  idCliente?: number
  nombreCliente: string
  producto: string
}

export default function SheetRegistrarPoliza({
  open,
  onOpenChange,
  idProceso,
  idProspecto,
  idCliente,
  nombreCliente,
  producto,
}: SheetRegistrarPolizaProps) {
  const queryClient = useQueryClient()
  const { data: companies, isLoading: cargandoCompanies } = useCompaniesSeguros()

  const [idCompany, setIdCompany] = useState('')
  const [numeroPoliza, setNumeroPoliza] = useState('')
  const [tipo, setTipo] = useState<'nueva' | 'renovacion'>('nueva')
  const [primaNeta, setPrimaNeta] = useState('')
  const [comisionPct, setComisionPct] = useState('')
  const [fechaEmision, setFechaEmision] = useState('')
  const [inicioVigencia, setInicioVigencia] = useState('')
  const [finVigencia, setFinVigencia] = useState('')
  const [guardando, setGuardando] = useState(false)

  const resetForm = () => {
    setIdCompany('')
    setNumeroPoliza('')
    setTipo('nueva')
    setPrimaNeta('')
    setComisionPct('')
    setFechaEmision('')
    setInicioVigencia('')
    setFinVigencia('')
  }

  const camposCompletos =
    idCompany &&
    numeroPoliza.trim() &&
    primaNeta.trim() &&
    comisionPct.trim() &&
    fechaEmision &&
    inicioVigencia &&
    finVigencia

  const handleGuardar = async () => {
    if (!camposCompletos) return

    setGuardando(true)
    try {
      await axios.post(`/api/procesos-comerciales/${idProceso}/polizas`, {
        numero_poliza: numeroPoliza.trim(),
        tipo,
        id_company: Number(idCompany),
        prima_neta: Number(primaNeta),
        comision_corredora_pct: Number(comisionPct),
        fecha_emision: fechaEmision,
        inicio_vigencia: inicioVigencia,
        fin_vigencia: finVigencia,
      })

      toast.success('Póliza registrada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['procesos-comerciales', idProspecto] })
      if (idCliente) {
        queryClient.invalidateQueries({ queryKey: ['polizas', idCliente] })
      }
      resetForm()
      onOpenChange(false)
    } catch {
      toast.error('Error al registrar la póliza')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col sm:max-w-md overflow-hidden'>
        <SheetHeader className='border-b border-border px-4 py-3'>
          <SheetTitle className='text-sm font-semibold'>Subir póliza</SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto px-4 py-3'>
          <div className='space-y-4'>
            <p className='text-xs leading-relaxed'>
              <span className='text-muted-foreground'>Cliente: </span>
              <span className='font-medium text-foreground'>{nombreCliente || '—'}</span>
            </p>
            <p className='text-xs leading-relaxed'>
              <span className='text-muted-foreground'>Oportunidad: </span>
              <span className='font-medium text-foreground'>{producto || '—'}</span>
            </p>

            <div className='space-y-1.5'>
              <Label className='text-xs'>Compañía aseguradora</Label>
              <Select
                value={idCompany}
                onValueChange={setIdCompany}
                disabled={cargandoCompanies}
              >
                <SelectTrigger className='h-9 text-sm shadow-none'>
                  <SelectValue placeholder='Seleccionar compañía' />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)} className='text-xs'>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs'>Número de póliza</Label>
              <Input
                className='h-9 text-sm shadow-none'
                value={numeroPoliza}
                onChange={(e) => setNumeroPoliza(e.target.value)}
                placeholder='Ej. POL-2026-001'
              />
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs'>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as 'nueva' | 'renovacion')}>
                <SelectTrigger className='h-9 text-sm shadow-none'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='nueva' className='text-xs'>Nueva</SelectItem>
                  <SelectItem value='renovacion' className='text-xs'>Renovación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='space-y-1.5'>
                <Label className='text-xs'>Prima neta</Label>
                <Input
                  className='h-9 text-sm shadow-none'
                  type='number'
                  inputMode='decimal'
                  value={primaNeta}
                  onChange={(e) => setPrimaNeta(e.target.value)}
                  placeholder='0'
                />
              </div>
              <div className='space-y-1.5'>
                <Label className='text-xs'>% Comisión corredora</Label>
                <Input
                  className='h-9 text-sm shadow-none'
                  type='number'
                  inputMode='decimal'
                  value={comisionPct}
                  onChange={(e) => setComisionPct(e.target.value)}
                  placeholder='0'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs'>Fecha de emisión</Label>
              <Input
                className='h-9 text-sm shadow-none'
                type='date'
                value={fechaEmision}
                onChange={(e) => setFechaEmision(e.target.value)}
              />
            </div>

            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='space-y-1.5'>
                <Label className='text-xs'>Inicio de vigencia</Label>
                <Input
                  className='h-9 text-sm shadow-none'
                  type='date'
                  value={inicioVigencia}
                  onChange={(e) => setInicioVigencia(e.target.value)}
                />
              </div>
              <div className='space-y-1.5'>
                <Label className='text-xs'>Término de vigencia</Label>
                <Input
                  className='h-9 text-sm shadow-none'
                  type='date'
                  value={finVigencia}
                  onChange={(e) => setFinVigencia(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className='border-t border-border px-4 py-3'>
          <div className='flex w-full flex-col gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='w-full text-xs shadow-none'
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              type='button'
              size='sm'
              className='w-full text-xs shadow-none'
              disabled={!camposCompletos || guardando}
              onClick={handleGuardar}
            >
              {guardando ? 'Guardando...' : 'Guardar póliza'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
