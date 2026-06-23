import { Badge } from '@/components/badge'
import { useRecordatorios } from '@/hooks/recordatorios/use-recordatorios'
import { formatearFecha } from '@/utils/formatear-fecha'
import { useMemo } from 'react'
import CardRecordatorio from './card-recordatorio/card-recordatorio'

type RecordatoriosUsuarioProps = {
	fecha: string
	idProspecto?: number
}

export default function RecordatoriosUsuario({
	fecha,
	idProspecto,
}: RecordatoriosUsuarioProps) {
	const { data: recordatorios } = useRecordatorios({
		fecha: fecha,
		id_prospecto: idProspecto,
	})

	const hoyIso = useMemo(() => formatearFecha(new Date(), 'yyyy-MM-dd'), [])

	const onCompletar = (idRecordatorio: string) => console.log('completado')
	const onEditar = (idRecordatorio: string) => console.log('editar')
	const onEliminar = (idRecordatorio: string) => console.log('eliminar')

	return (
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
				<Badge variant='outline' className='h-5 tabular-nums text-[10px]'>
					{recordatorios?.length ?? 0}
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
							onComplete={() => onCompletar(recordatorio.id.toString())}
							onEdit={() => onEditar(recordatorio.id.toString())}
							onDelete={() => onEliminar(recordatorio.id.toString())}
						/>
					))}
				</div>
			)}
		</div>
	)
}
