import { useState } from 'react'
import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import Recordatorio from '@/dominio/recordatorio/recordatorio'

import {
	etiquetaTipoRecordatorio,
	prioridadReminderStyles,
	reminderStatusLabel,
	reminderStatusStyles,
} from '@/types/shared/shared-reminders'
import { formatearFecha } from '@/utils/formatear-fecha'
import Link from 'next/link'
import DialogCrearRecordatorio from '@/components/dialog-crear-recordatorio/dialog-crear-recordatorio'

type RecordatoriosUsuarioProps = {
	recordatorio: Recordatorio
	onComplete: () => void
	onDelete: () => void
	prospectos?: ProspectoResumenJson[]
	isCompletando?: boolean
	isEliminando?: boolean
}

export default function CardRecordatorio({
	recordatorio,
	onComplete,
	onDelete,
	prospectos,
	isCompletando,
	isEliminando,
}: RecordatoriosUsuarioProps) {
	const [editando, setEditando] = useState(false)
	const esCobranza = recordatorio.tipo_gestion === 'cobranza_anticipada'
	const esRenovacion = Boolean(recordatorio.numero_poliza) && !esCobranza
	const asociado =
		!esRenovacion && !esCobranza && recordatorio.id_prospecto != null
	const prio = recordatorio.prioridad

	const badgePrincipal = esRenovacion
		? {
				label: `Póliza ${recordatorio.numero_poliza}`,
				className:
					'h-5 max-w-full truncate px-1.5 text-xs font-normal border-sky-500/25 bg-sky-500/10 text-sky-950 dark:text-sky-100',
			}
		: esCobranza
			? {
					label: `Cobranza — Póliza ${recordatorio.numero_poliza}`,
					href: `/polizas/${recordatorio.numero_poliza}`,
					className:
						'h-5 max-w-full truncate px-1.5 text-xs font-normal border-amber-500/25 bg-amber-500/10 text-amber-950 dark:text-amber-100',
				}
			: asociado
				? {
						label: recordatorio.nombre_prospecto?.trim() ?? '—',
						href: `/prospectos/${recordatorio.id_prospecto}`,
						className: 'h-5 max-w-full truncate px-1.5 text-xs font-normal',
					}
				: {
						label: 'General',
						className:
							'h-5 border-muted-foreground/30 bg-muted/50 px-1.5 text-xs font-normal text-muted-foreground',
					}

	return (
		<>
			<div className='rounded-md border border-border bg-secondary/25 px-2.5 py-2'>
				<div className='flex items-start justify-between gap-1.5'>
					<p className='text-xs font-medium leading-snug text-foreground'>
						{recordatorio.titulo}
					</p>
					<Badge
						variant={reminderStatusStyles[recordatorio.estado]}
						className='shrink-0 px-1 py-0 text-xs'
					>
						{reminderStatusLabel[recordatorio.estado]}
					</Badge>
				</div>
				<div className='mt-1 flex flex-wrap items-center gap-1'>
					{badgePrincipal.href ? (
						<Link href={badgePrincipal.href}>
							<Badge variant='outline' className={badgePrincipal.className}>
								{badgePrincipal.label}
							</Badge>
						</Link>
					) : (
						<Badge variant='outline' className={badgePrincipal.className}>
							{badgePrincipal.label}
						</Badge>
					)}
					<Badge
						variant={prioridadReminderStyles[prio]}
						className='h-5 px-1.5 text-xs'
					>
						{prio}
					</Badge>
				</div>
				<p className='mt-1 text-xs leading-tight text-muted-foreground'>
					{etiquetaTipoRecordatorio(recordatorio.tipo_gestion)} ·{' '}
					{formatearFecha(
						new Date(recordatorio.fecha_recordatorio),
						'dd-MM-yyyy HH:mm',
					)}
				</p>
				<p className='mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground'>
					{recordatorio.detalle}
				</p>
				<div className='mt-1.5 flex flex-wrap gap-1'>
					<Button
						size='sm'
						variant='outline'
						className='h-6 px-2 text-xs'
						onClick={onComplete}
						disabled={isCompletando}
					>
						{isCompletando ? 'Completando…' : 'Completar'}
					</Button>
					<>
						<Button
							size='sm'
							variant='outline'
							className='h-6 px-2 text-xs'
							onClick={() => setEditando(true)}
						>
							Editar
						</Button>
						<Button
							size='sm'
							variant='ghost'
							className='h-6 px-2 text-xs text-destructive hover:text-destructive'
							onClick={onDelete}
							disabled={isEliminando}
						>
							{isEliminando ? 'Eliminando…' : 'Eliminar'}
						</Button>
					</>
				</div>
			</div>

			<DialogCrearRecordatorio
				open={editando}
				onOpenChange={setEditando}
				editarRecordatorio={editando ? recordatorio : null}
				prospectos={prospectos}
			/>
		</>
	)
}
