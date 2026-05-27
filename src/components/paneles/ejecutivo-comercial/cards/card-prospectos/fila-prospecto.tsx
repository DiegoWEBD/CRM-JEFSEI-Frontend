import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { Badge } from '@/components/badge/badge'
import Button from '@/components/button/button'
import TableCell from '@/components/table/table-cell/table-cell'
import TableRow from '@/components/table/table-row/table-row'
import { classname } from '@/lib/class-name'
import Link from 'next/link'

interface FilaProspectoProps {
	prospecto: ProspectoResumenJson
}

export default function FilaProspecto({ prospecto }: FilaProspectoProps) {
	const contacto = prospecto.nombre_contacto ?? '—'

	return (
		<TableRow
			className={classname(
				'text-sm',
				prospecto.asignacion_pendiente_revision && 'bg-amber-500/6',
			)}
		>
			<TableCell className='max-w-50'>
				<div className='font-medium text-foreground'>
					{prospecto.nombre_riesgo}
				</div>

				{prospecto.nombre_riesgo ? (
					<p className='text-[10px] text-muted-foreground'>
						{prospecto.nombre_riesgo}
					</p>
				) : null}

				{prospecto.asignacion_pendiente_revision ? (
					<Badge
						variant='outline'
						className='mt-1 border-amber-500/40 text-[9px]'
					>
						Nuevo por revisar
					</Badge>
				) : null}
			</TableCell>
			<TableCell className='text-muted-foreground'>
				{prospecto.linea_negocio}
			</TableCell>
			<TableCell className='max-w-45 text-xs text-muted-foreground'>
				{contacto}
			</TableCell>
			<TableCell>
				<Badge
					variant='outline'
					className={classname(
						'text-[10px] font-medium',
						ESTADO_COMERCIAL_BADGE[prospecto.estado],
					)}
				>
					{ESTADO_COMERCIAL_BADGE[prospecto.estado]}
				</Badge>
			</TableCell>
			<TableCell className='text-right'>
				<Button size='sm' variant='outline' className='h-8 text-xs' asChild>
					<Link href={`/prospectos/${prospecto.id}`}>Ver perfil</Link>
				</Button>
			</TableCell>
		</TableRow>
	)
}
