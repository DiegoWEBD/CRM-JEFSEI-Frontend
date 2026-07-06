'use client'

import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Checkbox } from '@/components/checkbox'
import { Input } from '@/components/input'
import DialogCrearRecordatorio from '@/components/dialog-crear-recordatorio/dialog-crear-recordatorio'
import { useAuthContext } from '@/contexts/auth-context'
import { useRecordatorios } from '@/hooks/recordatorios/use-recordatorios'
import {
  prioridadReminderLabel,
  prioridadReminderStyles,
} from '@/types/shared/shared-reminders'
import { formatearFecha } from '@/utils/formatear-fecha'
import { cn } from '@/lib/utils'

const SECTION_TITLE =
  'text-sm font-semibold leading-tight tracking-tight text-foreground'

const MAX_RECORDATORIOS_VISIBLES = 3

const STATUS_PRIORITY: Record<string, number> = {
  atrasado: 0,
  pendiente: 1,
  realizado: 2,
}

type RecordatoriosClienteSectionProps = {
  idProspecto: number
  nombreCliente: string
  ejecutivoComercialRut?: string
}

export default function RecordatoriosClienteSection({
  idProspecto,
  nombreCliente,
  ejecutivoComercialRut,
}: RecordatoriosClienteSectionProps) {
  const { usuario, tieneAlgunRol } = useAuthContext()

  const puedeVer =
    usuario &&
    (tieneAlgunRol([
      'GERENTE_GENERAL',
      'GERENTE_COMERCIAL',
      'GERENTE_OPERACIONES',
    ]) ||
      usuario.rut === ejecutivoComercialRut)

  const puedeEditar = usuario?.rut === ejecutivoComercialRut

  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    () => formatearFecha(new Date(), 'yyyy-MM-dd'),
  )
  const [openModal, setOpenModal] = useState(false)
  const [verCompletados, setVerCompletados] = useState(false)
  const [verTodosPendientes, setVerTodosPendientes] = useState(false)

  const { data: recordatorios } = useRecordatorios({
    fecha: fechaSeleccionada,
    id_prospecto: idProspecto,
  })

  const todosOrdenados = useMemo(() => {
    if (!recordatorios) return []
    return [...recordatorios].sort((a, b) => {
      const sa = STATUS_PRIORITY[a.estado] ?? 1
      const sb = STATUS_PRIORITY[b.estado] ?? 1
      if (sa !== sb) return sa - sb
      return b.fecha_recordatorio.localeCompare(a.fecha_recordatorio)
    })
  }, [recordatorios])

  const completados = useMemo(
    () => todosOrdenados.filter((r) => r.estado === 'realizado'),
    [todosOrdenados],
  )

  const pendientes = useMemo(
    () => todosOrdenados.filter((r) => r.estado !== 'realizado'),
    [todosOrdenados],
  )

  const pendientesVisibles = useMemo(() => {
    if (verTodosPendientes) return pendientes
    return pendientes.slice(0, MAX_RECORDATORIOS_VISIBLES)
  }, [pendientes, verTodosPendientes])

  const hayMasPendientes = pendientes.length > MAX_RECORDATORIOS_VISIBLES

  if (!puedeVer) return null

  return (
    <>
      <Card className='border-border bg-card shadow-none'>
        <CardHeader className='flex flex-col gap-2 border-b border-border px-3 pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:px-4'>
          <CardTitle
            className={`${SECTION_TITLE} flex min-w-0 flex-wrap items-center gap-2`}
          >
            <svg
              className='h-3.5 w-3.5 shrink-0 text-muted-foreground'
              aria-hidden
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
              />
            </svg>
            Recordatorios del cliente
          </CardTitle>
          {puedeEditar ? (
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-8 w-full shrink-0 text-xs sm:w-auto'
              onClick={() => setOpenModal(true)}
            >
              <Plus className='mr-1 h-3.5 w-3.5' aria-hidden />
              Agregar recordatorio
            </Button>
          ) : null}
        </CardHeader>

        <CardContent className='space-y-3 p-3 sm:p-4'>
          <div className='w-full sm:w-auto'>
            <Input
              type='date'
              className='h-8 text-xs'
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
          </div>

          {!recordatorios || todosOrdenados.length === 0 ? (
            <p className='py-2 text-xs text-muted-foreground'>
              No hay recordatorios para este cliente.
            </p>
          ) : verCompletados ? (
            <>
              {completados.length === 0 ? (
                <p className='px-3 py-2 text-xs text-muted-foreground'>
                  No hay recordatorios completados.
                </p>
              ) : (
                <ul className='divide-y divide-border/70 rounded-md border border-border/70'>
                  {completados.map((r) => (
                    <RecordatorioClienteFila
                      key={r.id}
                      recordatorio={r}
                      onToggleCompletado={() =>
                        toast.info('Próximamente disponible')
                      }
                      onEditar={() =>
                        toast.info('Próximamente disponible')
                      }
                      onEliminar={() =>
                        toast.info('Próximamente disponible')
                      }
                    />
                  ))}
                </ul>
              )}
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-7 w-full text-[10px] text-muted-foreground'
                onClick={() => setVerCompletados(false)}
              >
                Volver a pendientes
              </Button>
            </>
          ) : (
            <>
              {pendientes.length === 0 ? (
                <p className='py-1 text-xs text-muted-foreground'>
                  No hay recordatorios pendientes para este cliente.
                </p>
              ) : (
                <ul className='divide-y divide-border/70 rounded-md border border-border/70'>
                  {pendientesVisibles.map((r) => (
                    <RecordatorioClienteFila
                      key={r.id}
                      recordatorio={r}
                      onToggleCompletado={() =>
                        toast.info('Próximamente disponible')
                      }
                      onEditar={() =>
                        toast.info('Próximamente disponible')
                      }
                      onEliminar={() =>
                        toast.info('Próximamente disponible')
                      }
                    />
                  ))}
                </ul>
              )}

              <div className='flex flex-col gap-1'>
                {hayMasPendientes && !verTodosPendientes ? (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-7 w-full text-[10px] text-muted-foreground'
                    onClick={() => setVerTodosPendientes(true)}
                  >
                    Ver todos los recordatorios ({pendientes.length})
                  </Button>
                ) : null}
                {verTodosPendientes && hayMasPendientes ? (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-7 w-full text-[10px] text-muted-foreground'
                    onClick={() => setVerTodosPendientes(false)}
                  >
                    Ver menos
                  </Button>
                ) : null}
                {completados.length > 0 ? (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-7 w-full text-[10px] text-muted-foreground'
                    onClick={() => setVerCompletados(true)}
                  >
                    Ver completados ({completados.length})
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <DialogCrearRecordatorio
        open={openModal}
        onOpenChange={setOpenModal}
        idProspectoInicial={idProspecto}
      />
    </>
  )
}

const btnAccionClass =
  'h-6 gap-0.5 px-1.5 text-[10px] font-normal shadow-none'

function RecordatorioClienteFila({
  recordatorio: r,
  onToggleCompletado,
  onEditar,
  onEliminar,
}: {
  recordatorio: {
    id: number
    titulo: string
    detalle: string | null
    completado: boolean
    prioridad: string
    estado: string
    fecha_recordatorio: string
  }
  onToggleCompletado: () => void
  onEditar: () => void
  onEliminar: () => void
}) {
  const completado = r.estado === 'realizado'
  const prio = r.prioridad === 'alta' ? 'alta' : 'normal'
  const d = new Date(r.fecha_recordatorio)
  const metaFecha = formatearFecha(d, "d MMM yyyy '·' HH:mm")
  const metaLinea = `${metaFecha} · ${r.detalle?.trim() || 'Sin descripción'}`

  return (
    <li
      className={cn(
        'flex flex-col gap-2 px-2.5 py-2.5 sm:flex-row sm:items-center sm:gap-2.5 sm:py-2',
        completado && 'opacity-75',
      )}
    >
      <div className='flex min-w-0 items-start gap-2.5 sm:flex-1 sm:items-center'>
        <Checkbox
          checked={completado}
          onCheckedChange={() => onToggleCompletado()}
          className='mt-0.5 shrink-0 sm:mt-0'
          aria-label={
            completado
              ? 'Marcar como pendiente'
              : 'Marcar como completado'
          }
        />

        <div className='min-w-0 flex-1 space-y-0.5'>
          <p
            className={cn(
              'text-xs font-medium leading-snug text-foreground sm:truncate',
              completado && 'line-through text-muted-foreground',
            )}
          >
            {r.titulo}
          </p>
          <p
            className={cn(
              'text-[10px] leading-snug text-muted-foreground sm:truncate',
              completado && 'line-through opacity-80',
            )}
          >
            {metaLinea}
          </p>
        </div>

        <Badge
          variant='outline'
          className={cn(
            'h-5 shrink-0 px-1.5 text-[9px] sm:hidden',
            prioridadReminderStyles[prio],
          )}
        >
          {prioridadReminderLabel[prio]}
        </Badge>
      </div>

      <div className='flex flex-wrap items-center gap-1 border-t border-border/50 pt-2 sm:shrink-0 sm:border-0 sm:pt-0'>
        <Badge
          variant='outline'
          className={cn(
            'hidden h-5 px-1.5 text-[9px] sm:inline-flex',
            prioridadReminderStyles[prio],
          )}
        >
          {prioridadReminderLabel[prio]}
        </Badge>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className={btnAccionClass}
          onClick={onEditar}
        >
          <svg
            className='size-3'
            aria-hidden
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
            />
          </svg>
          Editar
        </Button>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className={cn(btnAccionClass, 'text-destructive hover:text-destructive')}
          onClick={onEliminar}
        >
          <svg
            className='size-3'
            aria-hidden
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
          Eliminar
        </Button>
      </div>
    </li>
  )
}
