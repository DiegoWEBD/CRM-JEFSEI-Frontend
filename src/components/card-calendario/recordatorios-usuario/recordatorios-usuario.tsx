import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { Badge } from '@/components/badge'
import { ConfirmDialog } from '@/components/confirm-dialog'

import { useRecordatorios } from '@/hooks/recordatorios/use-recordatorios'
import { useCompletarRecordatorio } from '@/hooks/recordatorios/use-completar-recordatorio'
import { useEliminarRecordatorio } from '@/hooks/recordatorios/use-eliminar-recordatorio'
import { formatearFecha } from '@/utils/formatear-fecha'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import CardRecordatorio from './card-recordatorio/card-recordatorio'
import Paginacion from '@/components/paginacion/paginacion'

type ConfirmAction =
	| { type: 'completar'; id: number }
	| { type: 'eliminar'; id: number }

type RecordatoriosUsuarioProps = {
	fecha: string
	idProspecto?: number
	prospectos?: ProspectoResumenJson[]
}

export default function RecordatoriosUsuario({
	fecha,
	idProspecto,
	prospectos,
}: RecordatoriosUsuarioProps) {
	const [pagina, setPagina] = useState(1)
	const tamano_pagina = 15

	const { data } = useRecordatorios({
		fecha: fecha,
		id_prospecto: idProspecto,
		pagina,
		tamano_pagina,
	})
	const recordatorios = data?.data
	const total = data?.total ?? 0
	const totalPaginas = data?.total_paginas ?? 1
	const completarMutation = useCompletarRecordatorio()
	const eliminarMutation = useEliminarRecordatorio()
	const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)

	const hoyIso = useMemo(() => formatearFecha(new Date(), 'yyyy-MM-dd'), [])

	function onConfirm() {
		if (!confirmAction) return
		const { type, id } = confirmAction
		if (type === 'completar') {
			completarMutation.mutate(id, {
				onSuccess: () => {
					toast.success('Recordatorio completado')
					setConfirmAction(null)
				},
			})
		} else {
			eliminarMutation.mutate(id, {
				onSuccess: () => {
					toast.success('Recordatorio eliminado')
					setConfirmAction(null)
				},
			})
		}
	}

	return (
		<>
			<div className='min-w-0 space-y-2 border-t border-border/60 pt-3 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0'>
				<div className='flex flex-wrap items-baseline justify-between gap-2'>
					<p className='text-xs font-medium text-foreground'>
						Recordatorios del {formatearFecha(new Date(fecha), 'dd/MM/yyyy')}
						{fecha === hoyIso && (
							<span className='ml-1 font-normal text-muted-foreground'>
								· Hoy
							</span>
						)}
					</p>
					<Badge variant='outline' className='h-5 tabular-nums text-xs'>
						{total}
					</Badge>
				</div>
				{recordatorios?.length === 0 ? (
					<p className='rounded-md border border-dashed border-border/80 py-6 text-center text-xs text-muted-foreground'>
						No hay recordatorios para esta fecha.
					</p>
				) : (
					<div className='max-h-[min(52vh,420px)] space-y-2 overflow-y-auto pr-0.5'>
						{recordatorios?.map(recordatorio => (
							<CardRecordatorio
								key={recordatorio.id}
								recordatorio={recordatorio}
								onComplete={() =>
									setConfirmAction({ type: 'completar', id: recordatorio.id })
								}
								onDelete={() =>
									setConfirmAction({ type: 'eliminar', id: recordatorio.id })
								}
								prospectos={prospectos}
								isCompletando={completarMutation.isPending}
								isEliminando={eliminarMutation.isPending}
							/>
						))}
					</div>
				)}
				<Paginacion
					pagina={pagina}
					totalPaginas={totalPaginas}
					onPaginaChange={setPagina}
				/>
			</div>

			<ConfirmDialog
				open={confirmAction !== null}
				onOpenChange={() => setConfirmAction(null)}
				title={
					confirmAction?.type === 'completar'
						? '¿Completar recordatorio?'
						: '¿Eliminar recordatorio?'
				}
				onConfirm={onConfirm}
				isPending={
					confirmAction?.type === 'completar'
						? completarMutation.isPending
						: eliminarMutation.isPending
				}
			/>
		</>
	)
}
