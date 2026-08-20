import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { Badge } from '@/components/badge/badge'
import { Button } from '@/components/button'
import { classname } from '@/lib/class-name'
import {
	ESTADO_GENERAL_CLIENTE_BADGE,
	ESTADO_GENERAL_CLIENTE_LABELS,
	type EstadoGeneralCliente,
} from '@/lib/estados-cotizaciones'
import { Briefcase, CreditCard, MapPin, User, UserCheck } from 'lucide-react'
import { ESTADO_COMERCIAL_VARIANT } from '@/lib/badge-variants'
import {
	ESTADO_PROSPECTO_LABELS,
	type EstadoComercialProspecto,
} from '@/types/estados/estado-comercial-cliente'
import { resaltarTexto, resaltarRut } from '@/lib/resaltar-texto'
import Link from 'next/link'
import { useMemo } from 'react'

interface FilaProspectoProps {
	prospecto: ProspectoResumenJson
	className?: string
	textoBusqueda?: string
}

export default function FilaProspecto({
	prospecto,
	className,
	textoBusqueda = '',
}: FilaProspectoProps) {
	const estadoGeneral = (prospecto.estado_general_cliente ||
		'prospecto') as EstadoGeneralCliente

	const procesosAbiertos = useMemo(
		() =>
			prospecto.procesos_comerciales.filter(
				proceso =>
					proceso.codigo_estado !== null &&
					proceso.codigo_estado !== 'GANADO' &&
					proceso.codigo_estado !== 'PERDIDO',
			),
		[prospecto.procesos_comerciales],
	)

	return (
		<div
			className={classname(
				'flex items-start justify-between gap-3 px-3 py-3 text-xs transition-colors hover:bg-muted/40',
				className,
			)}
		>
			<div className='min-w-0 flex-1 space-y-1.5'>
				<p className='truncate text-sm font-semibold leading-snug text-foreground'>
					{resaltarTexto(prospecto.nombre_riesgo, textoBusqueda)}
				</p>
				<Badge
					variant={ESTADO_GENERAL_CLIENTE_BADGE[estadoGeneral]}
					className='text-[10px]'
				>
					{ESTADO_GENERAL_CLIENTE_LABELS[estadoGeneral]}
				</Badge>
				<div className='flex flex-wrap items-center gap-1.5'>
					{procesosAbiertos.map((proceso, i) => (
						<Badge
							key={i}
							variant={
								ESTADO_COMERCIAL_VARIANT[
									proceso.codigo_estado as EstadoComercialProspecto
								]
							}
							className='text-[10px]'
						>
							{ESTADO_PROSPECTO_LABELS[
								proceso.codigo_estado as EstadoComercialProspecto
							] ?? proceso.nombre_estado}
						</Badge>
					))}
				</div>

				<div className='flex flex-col gap-1 text-muted-foreground sm:flex-row sm:gap-x-3'>
					{prospecto.rut_riesgo && (
						<span className='flex items-center gap-1'>
							<CreditCard size={14} />
							<span className='rounded bg-muted px-1.5 py-0.5 font-medium text-foreground'>
								{resaltarRut(prospecto.rut_riesgo, textoBusqueda)}
							</span>
						</span>
					)}
					<span className='flex items-center gap-1'>
						<Briefcase size={14} />
						{resaltarTexto(prospecto.linea_negocio, textoBusqueda)}
					</span>
					{prospecto.comuna && (
						<span className='flex items-center gap-1'>
							<MapPin size={14} />
							{resaltarTexto(prospecto.comuna, textoBusqueda)}
						</span>
					)}
				</div>
				<div className='flex flex-col gap-1 text-muted-foreground sm:flex-row sm:gap-x-3'>
					{prospecto.nombre_administrador && (
						<span className='flex items-center gap-1'>
							<User size={14} />
							Admin: {resaltarTexto(prospecto.nombre_administrador, textoBusqueda)}
						</span>
					)}
					{prospecto.ejecutivo_comercial && (
						<span className='flex items-center gap-1'>
							<UserCheck size={14} />
							Ejec: {resaltarTexto(prospecto.ejecutivo_comercial, textoBusqueda)}
						</span>
					)}
				</div>
			</div>
			<Button
				size='sm'
				variant='outline'
				className='h-8 shrink-0 px-3 text-xs transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground'
			>
				<Link href={`/prospectos/${prospecto.id}`}>Ver</Link>
			</Button>
		</div>
	)
}
