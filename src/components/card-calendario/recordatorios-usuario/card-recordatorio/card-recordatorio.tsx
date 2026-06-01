import { Badge } from '@/components/badge/badge'
import Button from '@/components/button/button'
import Recordatorio from '@/dominio/recordatorio/recordatorio'
import { classname } from '@/lib/class-name'
import {
	etiquetaTipoRecordatorio,
	prioridadReminderStyles,
	reminderStatusLabel,
	reminderStatusStyles,
} from '@/types/shared/shared-reminders'
import { formatearFecha } from '@/utils/formatear-fecha'

type RecordatoriosUsuarioProps = {
	recordatorio: Recordatorio
	onComplete: () => void
	onEdit: () => void
	onDelete: () => void
}

export default function CardRecordatorio({
	recordatorio,
	onComplete,
	onEdit,
	onDelete,
}: RecordatoriosUsuarioProps) {
	const asociado = recordatorio.id_prospecto !== undefined
	const prio = recordatorio.prioridad

	const clienteLabel = recordatorio.nombre_prospecto?.trim()

	return (
		<div className='rounded-md border border-border bg-secondary/25 px-2.5 py-2'>
			<div className='flex items-start justify-between gap-1.5'>
				<p className='text-xs font-medium leading-snug text-foreground'>
					{recordatorio.titulo}
				</p>
				<Badge
					className={classname(
						'shrink-0 px-1 py-0 text-[9px]',
						reminderStatusStyles[recordatorio.estado],
					)}
				>
					{reminderStatusLabel[recordatorio.estado]}
				</Badge>
			</div>
			<div className='mt-1 flex flex-wrap items-center gap-1'>
				{asociado ? (
					<Badge
						variant='outline'
						className='h-5 max-w-full truncate px-1.5 text-[9px] font-normal'
					>
						{clienteLabel}
					</Badge>
				) : (
					<Badge
						variant='outline'
						className='h-5 border-muted-foreground/30 bg-muted/50 px-1.5 text-[9px] font-normal text-muted-foreground'
					>
						General
					</Badge>
				)}
				<Badge
					variant='outline'
					className={classname(
						'h-5 px-1.5 text-[9px]',
						prioridadReminderStyles[prio],
					)}
				>
					{prio}
				</Badge>
			</div>
			<p className='mt-1 text-[10px] leading-tight text-muted-foreground'>
				{etiquetaTipoRecordatorio(recordatorio.tipo_gestion)} ·{' '}
				{formatearFecha(
					new Date(recordatorio.fecha_recordatorio),
					'dd-MM-yyyy',
				)}
			</p>
			<p className='mt-0.5 line-clamp-2 text-[10px] leading-snug text-muted-foreground'>
				{recordatorio.detalle}
			</p>
			<div className='mt-1.5 flex flex-wrap gap-1'>
				<Button
					size='sm'
					variant='outline'
					className='h-6 px-2 text-[10px]'
					onClick={onComplete}
				>
					Completar
				</Button>
				<>
					<Button
						size='sm'
						variant='outline'
						className='h-6 px-2 text-[10px]'
						onClick={onEdit}
					>
						Editar
					</Button>
					<Button
						size='sm'
						variant='ghost'
						className='h-6 px-2 text-[10px] text-destructive hover:text-destructive'
						onClick={onDelete}
					>
						Eliminar
					</Button>
				</>
			</div>
		</div>
	)
}
