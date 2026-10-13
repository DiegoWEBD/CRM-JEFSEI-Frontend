'use client'

import {
	EstadoConfiguracion,
	EtapaConfiguracion,
} from '@/aplicacion/estados-admin/dto/estado-configuracion'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/accordion'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { Skeleton } from '@/components/skeleton'
import { ArrowRightLeft, Settings2 } from 'lucide-react'

import { probabilidadCierreBadgeVariant } from '@/components/badge/variants/probabilidad-cierre-variants'
import { formatearProbabilidad } from './formato-estados'

type TablaEstadosProps = {
	/** Etapas ya ordenadas, cada una con sus estados por probabilidad ascendente. */
	etapas: EtapaConfiguracion[]
	isFetching: boolean
	/** Código del estado cuyas transiciones están desplegadas, si alguna. */
	codigoEstadoTransiciones: string | null
	onConfigurar: (estado: EstadoConfiguracion) => void
	onVerTransiciones: (estado: EstadoConfiguracion) => void
}

function Acciones({
	estado,
	activas,
	onConfigurar,
	onVerTransiciones,
}: {
	estado: EstadoConfiguracion
	activas: boolean
	onConfigurar: (estado: EstadoConfiguracion) => void
	onVerTransiciones: (estado: EstadoConfiguracion) => void
}) {
	return (
		<div className='flex items-center justify-end gap-1'>
			<PermissionGuard
				allowedPermissions={['ADMINISTRAR_ESTADOS_PROCESO_COMERCIAL']}
			>
				<Button
					variant='ghost'
					size='icon'
					className='size-8'
					title='Configurar probabilidad de cierre'
					onClick={() => onConfigurar(estado)}
				>
					<Settings2 className='size-4' />
				</Button>

				<Button
					variant={activas ? 'secondary' : 'ghost'}
					size='icon'
					className='size-8'
					title='Ver transiciones del estado'
					onClick={() => onVerTransiciones(estado)}
				>
					<ArrowRightLeft className='size-4' />
				</Button>
			</PermissionGuard>
		</div>
	)
}

/** Listado de estados de una etapa: cards en mobile y tabla densa en desktop. */
function ListadoEstados({
	estados,
	codigoEstadoTransiciones,
	onConfigurar,
	onVerTransiciones,
}: {
	estados: EstadoConfiguracion[]
	codigoEstadoTransiciones: string | null
	onConfigurar: (estado: EstadoConfiguracion) => void
	onVerTransiciones: (estado: EstadoConfiguracion) => void
}) {
	return (
		<>
			{/* Mobile: cards */}
			<div className='space-y-3 lg:hidden'>
				{estados.map(estado => (
					<Card
						key={estado.codigo}
						className={
							estado.codigo === codigoEstadoTransiciones
								? 'border-primary/40 bg-card shadow-none'
								: 'border-border bg-card shadow-none'
						}
					>
						<CardContent className='p-4'>
							<div className='flex items-start justify-between gap-2'>
								<div className='min-w-0 flex-1 space-y-2'>
									<p className='truncate text-sm font-semibold text-foreground'>
										{estado.nombre}
									</p>
									<div className='flex flex-wrap items-center gap-2'>
										<Badge
											variant={probabilidadCierreBadgeVariant(
												estado.probabilidad_cierre,
											)}
										>
											{formatearProbabilidad(estado.probabilidad_cierre)}
										</Badge>
										<Badge variant='pastel-slate'>
											{estado.cantidad_transiciones}{' '}
											{estado.cantidad_transiciones === 1
												? 'transición'
												: 'transiciones'}
										</Badge>
									</div>
								</div>
								<div className='flex shrink-0 gap-1'>
									<Acciones
										estado={estado}
										activas={estado.codigo === codigoEstadoTransiciones}
										onConfigurar={onConfigurar}
										onVerTransiciones={onVerTransiciones}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Desktop: tabla densa */}
			<div className='hidden lg:block'>
				<div className='overflow-x-auto rounded-lg border border-border'>
					<table className='w-full table-fixed text-sm'>
						<thead>
							<tr className='border-b border-border bg-muted/40'>
								<th className='w-[34%] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Estado
								</th>
								<th className='w-[30%] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Prob. cierre
								</th>
								<th className='w-[36%] px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Acciones
								</th>
							</tr>
						</thead>
						<tbody>
							{estados.map(estado => (
								<tr
									key={estado.codigo}
									className={
										estado.codigo === codigoEstadoTransiciones
											? 'border-b border-border/50 bg-primary/5 transition-colors last:border-b-0'
											: 'border-b border-border/50 transition-colors hover:bg-accent/50 last:border-b-0'
									}
								>
									<td className='px-4 py-2.5'>
										<p className='truncate font-semibold text-foreground'>
											{estado.nombre}
										</p>
									</td>
									<td className='px-4 py-2.5'>
										<Badge
											variant={probabilidadCierreBadgeVariant(
												estado.probabilidad_cierre,
											)}
										>
											{formatearProbabilidad(estado.probabilidad_cierre)}
										</Badge>
									</td>
									<td className='px-4 py-2.5'>
										<Acciones
											estado={estado}
											activas={estado.codigo === codigoEstadoTransiciones}
											onConfigurar={onConfigurar}
											onVerTransiciones={onVerTransiciones}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

export default function TablaEstados({
	etapas,
	isFetching,
	codigoEstadoTransiciones,
	onConfigurar,
	onVerTransiciones,
}: TablaEstadosProps) {
	if (isFetching) {
		return (
			<div className='space-y-2'>
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className='h-12 w-full rounded-md' />
				))}
			</div>
		)
	}

	if (etapas.length === 0) {
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					No se encontraron estados
				</p>
			</div>
		)
	}

	return (
		<Accordion
			type='multiple'
			defaultValue={etapas.map(etapa => etapa.codigo_etapa)}
		>
			{etapas.map(etapa => (
				<AccordionItem key={etapa.codigo_etapa} value={etapa.codigo_etapa}>
					<AccordionTrigger className='py-3'>
						<span className='flex flex-wrap items-center gap-2'>
							<span className='text-sm font-semibold text-foreground'>
								{etapa.nombre_etapa}
							</span>
							<Badge variant='pastel-slate'>
								{etapa.estados.length}{' '}
								{etapa.estados.length === 1 ? 'estado' : 'estados'}
							</Badge>
						</span>
					</AccordionTrigger>

					<AccordionContent>
						<ListadoEstados
							estados={etapa.estados}
							codigoEstadoTransiciones={codigoEstadoTransiciones}
							onConfigurar={onConfigurar}
							onVerTransiciones={onVerTransiciones}
						/>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}
