import { Badge } from '@/components/badge'
import Poliza from '@/dominio/poliza/poliza'
import { classname } from '@/lib/class-name'
import {
	ESTADO_POLIZA_PERFIL_BADGE,
	ESTADO_POLIZA_PERFIL_LABELS,
} from '@/lib/estados-cotizaciones'
import { formatearFecha } from '@/utils/formatear-fecha'
import { useState } from 'react'

type ItemPolizaProps = {
	poliza: Poliza
}

export default function ItemPoliza({ poliza }: ItemPolizaProps) {
	const [verDetalle, setVerDetalle] = useState<boolean>(false)

	return (
		<li>
			<button
				type='button'
				onClick={() => setVerDetalle(!verDetalle)}
				className='w-full flex justify-between text-left text-xs leading-snug text-foreground hover:underline cursor-pointer'
			>
				<p>
					· Póliza {poliza.numero_poliza} · {poliza.company ?? undefined}
				</p>
				<Badge
					className={classname(
						ESTADO_POLIZA_PERFIL_BADGE[poliza.estado],
						'text-[10px]',
					)}
				>
					{ESTADO_POLIZA_PERFIL_LABELS[poliza.estado]}
				</Badge>
			</button>

			{verDetalle && (
				<div className='mt-1 rounded border border-border/60 bg-muted/15 px-2 py-1.5 text-[11px] text-muted-foreground'>
					<p>
						Vigencia: {poliza.inicio_vigencia || 'No indicado'} —{' '}
						{poliza.fin_vigencia || 'No indicado'}
					</p>
					<p>
						Emisión:{' '}
						{formatearFecha(new Date(poliza.fecha_emision), 'dd-MM-yyyy')}
					</p>
					<p>Prima neta: {poliza.prima_neta}</p>
					<p>Tipo: {poliza.tipo}</p>
				</div>
			)}
		</li>
	)
}
