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

type CardRecordatorioProps = {
	recordatorio: Recordatorio
	onComplete: () => void
	onDelete: () => void
	prospectos?: ProspectoResumenJson[]
	isCompletando?: boolean
	isEliminando?: boolean
}

type BadgePrincipal = {
	label: string
	href?: string
	variant:
		| 'pastel-sky'
		| 'pastel-amber'
		| 'pastel-indigo'
		| 'pastel-muted'
}

export default function CardRecordatorio({
	recordatorio,
	onComplete,
	onDelete,
	prospectos,
	isCompletando,
	isEliminando,
}: CardRecordatorioProps) {
	const [editando, setEditando] = useState(false)
	const esCobranza = recordatorio.tipo_gestion === 'cobranza_anticipada'
	const esRenovacion = Boolean(recordatorio.numero_poliza) && !esCobranza
	const asociado =
		!esRenovacion && !esCobranza && recordatorio.id_prospecto != null
	const prio = recordatorio.prioridad

	const badgePrincipal: BadgePrincipal = esRenovacion
		? {
				label: `Póliza ${recordatorio.numero_poliza}`,
				variant: 'pastel-sky',
			}
		: esCobranza
			? {
					label: `Cobranza — Póliza ${recordatorio.numero_poliza}`,
					href: `/polizas/${recordatorio.numero_poliza}`,
					variant: 'pastel-amber',
				}
			: asociado
				? {
						label: recordatorio.nombre_prospecto?.trim() ?? '—',
						href: `/prospectos/${recordatorio.id_prospecto}`,
						variant: 'pastel-indigo',
					}
				: {
						label: 'General',
						variant: 'pastel-muted',
					}

	return (
		<>
			<div className='rounded-md border border-border bg-card px-3 py-2.5'>
				<div className='flex items-start justify-between gap-2'>
					<p className='text-sm font-semibold leading-snug text-foreground'>
						{recordatorio.titulo}
					</p>
					<Badge
						variant={reminderStatusStyles[recordatorio.estado]}
						className='shrink-0 px-1.5 py-0 text-[11px]'
					>
						{reminderStatusLabel[recordatorio.estado]}
					</Badge>
				</div>

				<div className='mt-1.5 flex flex-wrap items-center gap-1.5'>
					{badgePrincipal.href ? (
						<Link
							href={badgePrincipal.href}
							className='transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md'
						>
							<Badge
								variant={badgePrincipal.variant}
								className='h-5 max-w-full truncate px-1.5 text-xs font-normal hover:underline underline-offset-4'
							>
								{badgePrincipal.label}
							</Badge>
						</Link>
					) : (
						<Badge
							variant={badgePrincipal.variant}
							className='h-5 max-w-full truncate px-1.5 text-xs font-normal'
						>
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

				<p className='mt-1.5 text-xs text-muted-foreground'>
					{etiquetaTipoRecordatorio(recordatorio.tipo_gestion)} ·{' '}
					{formatearFecha(
						new Date(recordatorio.fecha_recordatorio),
						'dd-MM-yyyy HH:mm',
					)}
				</p>

				{recordatorio.detalle && (
					<p className='mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground'>
						{recordatorio.detalle}
					</p>
				)}

				<div className='mt-2 flex flex-wrap gap-1'>
					<Button
						size='sm'
						variant='outline'
						className='h-6 px-2 text-xs'
						onClick={onComplete}
						disabled={isCompletando}
					>
						{isCompletando ? 'Completando…' : 'Completar'}
					</Button>
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