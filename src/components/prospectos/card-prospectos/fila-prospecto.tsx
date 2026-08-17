import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { Button } from '@/components/button'
import { classname } from '@/lib/class-name'
import Link from 'next/link'

interface FilaProspectoProps {
	prospecto: ProspectoResumenJson
	className?: string
}

export default function FilaProspecto({
	prospecto,
	className,
}: FilaProspectoProps) {
	return (
		<div
			className={classname(
				'flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-xs',
				className,
			)}
		>
			<div className='min-w-0 flex-1'>
				<p className='truncate font-medium leading-snug text-foreground'>
					{prospecto.nombre_riesgo}
				</p>
				<p className='truncate text-sm leading-snug text-muted-foreground'>
					{prospecto.linea_negocio} Â·{' '}
					{prospecto.id_cliente ? 'Cliente' : 'Prospecto'}
				</p>
			</div>
			<Button
				size='sm'
				variant='outline'
				className='h-7 shrink-0 px-2.5 text-xs'
			>
				<Link href={`/prospectos/${prospecto.id}`}>Ver prospecto</Link>
			</Button>
		</div>
	)
}
