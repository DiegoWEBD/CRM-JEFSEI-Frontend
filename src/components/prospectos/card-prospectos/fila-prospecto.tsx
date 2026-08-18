import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { Badge } from '@/components/badge/badge'
import { Button } from '@/components/button'
import { classname } from '@/lib/class-name'
import {
	ESTADO_GENERAL_CLIENTE_BADGE,
	ESTADO_GENERAL_CLIENTE_LABELS,
	type EstadoGeneralCliente,
} from '@/lib/estados-cotizaciones'
import { ESTADO_COMERCIAL_VARIANT } from '@/lib/badge-variants'
import {
	ESTADO_PROSPECTO_LABELS,
	type EstadoComercialProspecto,
} from '@/types/estados/estado-comercial-cliente'
import Link from 'next/link'

interface FilaProspectoProps {
	prospecto: ProspectoResumenJson
	className?: string
}

export default function FilaProspecto({
	prospecto,
	className,
}: FilaProspectoProps) {
	const estadoGeneral = (prospecto.estado_general_cliente ||
		'prospecto') as EstadoGeneralCliente

	const ultimoProceso =
		prospecto.procesos_comerciales.length > 0
			? prospecto.procesos_comerciales[
					prospecto.procesos_comerciales.length - 1
				]
			: null

	return (
		<div
			className={classname(
				'flex items-start justify-between gap-3 rounded-md border px-3 py-2.5 text-xs',
				className,
			)}
		>
			<div className='min-w-0 flex-1 space-y-1'>
				<div className='flex flex-wrap items-center gap-1.5'>
					<Badge
						variant={ESTADO_GENERAL_CLIENTE_BADGE[estadoGeneral]}
						className='text-[10px]'
					>
						{ESTADO_GENERAL_CLIENTE_LABELS[estadoGeneral]}
					</Badge>
					{ultimoProceso && ultimoProceso.codigo_estado !== null && (
						<Badge
							variant={
								ESTADO_COMERCIAL_VARIANT[
									ultimoProceso.codigo_estado as EstadoComercialProspecto
								]
							}
							className='text-[10px]'
						>
							{ESTADO_PROSPECTO_LABELS[
								ultimoProceso.codigo_estado as EstadoComercialProspecto
							] ?? ultimoProceso.nombre_estado}
						</Badge>
					)}
				</div>
				<p className='truncate font-medium leading-snug text-foreground'>
					{prospecto.nombre_riesgo}
				</p>
				<div className='flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-muted-foreground'>
					<span>{prospecto.linea_negocio}</span>
					{prospecto.nombre_administrador && (
						<>
							<span>·</span>
							<span>{prospecto.nombre_administrador}</span>
						</>
					)}
					{prospecto.ejecutivo_comercial && (
						<>
							<span>·</span>
							<span>Ejec: {prospecto.ejecutivo_comercial}</span>
						</>
					)}
				</div>
			</div>
			<Button
				size='sm'
				variant='outline'
				className='h-7 shrink-0 px-2.5 text-xs'
			>
				<Link href={`/prospectos/${prospecto.id}`}>Ver</Link>
			</Button>
		</div>
	)
}
