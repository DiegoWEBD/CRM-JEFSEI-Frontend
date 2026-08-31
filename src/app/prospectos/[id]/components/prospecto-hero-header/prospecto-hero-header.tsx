'use client'

import { Badge } from '@/components/badge'
import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import { useObtenerContactos } from '@/hooks/contactos/use-obtener-contactos'
import { useQueryPolizas } from '@/hooks/polizas/use-query-polizas'
import {
	ESTADO_GENERAL_CLIENTE_BADGE,
	ESTADO_GENERAL_CLIENTE_LABELS,
	type EstadoGeneralCliente,
} from '@/lib/estados-cotizaciones'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import {
	Building2,
	CheckCircle2,
	Shield,
	TrendingUp,
	Users,
	type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import AdministradorAsociado from '../pagina-prospecto-header/administrador-asociado/administrador-asociado'
import { useMemo } from 'react'

type ProspectoHeroHeaderProps = {
	prospecto: Prospecto
}

function KpiSummaryCard({
	icon: Icon,
	label,
	value,
	color,
}: {
	icon: LucideIcon
	label: string
	value: string | number
	color: string
}) {
	return (
		<div className='flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5'>
			<div
				className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${color}`}
			>
				<Icon className='h-4 w-4' aria-hidden />
			</div>
			<div className='min-w-0'>
				<p className='truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
					{label}
				</p>
				<p className='text-base font-bold tabular-nums text-foreground'>
					{value}
				</p>
			</div>
		</div>
	)
}

export default function ProspectoHeroHeader({
	prospecto,
}: ProspectoHeroHeaderProps) {
	const esCondominio =
		prospecto.linea_negocio.nombre.toLowerCase() === 'condominio'
	const tieneCliente = Boolean(prospecto.id_cliente)

	const estadoCliente: EstadoGeneralCliente =
		(prospecto.estado_general_cliente as EstadoGeneralCliente) || 'prospecto'

	const lineaNegocioLabel = prospecto.linea_negocio.nombre

	const { data: polizas } = useQueryPolizas(
		tieneCliente ? prospecto.id_cliente : undefined,
	)
	const { data: contactos } = useObtenerContactos(prospecto.id)

	const kpis = useMemo(() => {
		const polizasVigentes =
			polizas?.filter(p => p.estado === 'VIGENTE' || p.estado === 'POR_VENCER')
				.length ?? 0

		const primaVigente =
			polizas
				?.filter(p => p.estado !== 'VENCIDA' && p.estado !== 'CANCELADA')
				.reduce((sum, p) => sum + p.prima_neta, 0) ?? 0

		const contactosCount = contactos?.length ?? 0

		return { polizasVigentes, primaVigente, contactosCount }
	}, [polizas, contactos])

	return (
		<section className='rounded-xl border border-border bg-card'>
			<div className='p-4 sm:p-5 lg:p-6'>
				{/* Breadcrumb */}
				<nav className='mb-4 text-xs text-muted-foreground'>
					<Link
						href='/prospectos'
						className='transition-colors hover:text-foreground'
					>
						Prospectos
					</Link>
					<span className='mx-1.5'>/</span>
					<span className='font-medium text-foreground'>
						{prospecto.nombre_riesgo}
					</span>
				</nav>

				<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
					{/* Left: Client info */}
					<div className='min-w-0 flex-1'>
						<div className='flex items-start gap-3 sm:gap-4'>
							<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-14 sm:w-14'>
								<Building2 className='h-6 w-6 sm:h-7 sm:w-7' aria-hidden />
							</div>
							<div className='min-w-0 flex-1'>
								<h1 className='text-xl font-bold leading-tight tracking-tight text-foreground wrap-break-words sm:text-2xl lg:text-3xl'>
									{prospecto.nombre_riesgo}
								</h1>
								<div className='mt-2 flex flex-wrap items-center gap-2'>
									<Badge variant='secondary' className='text-xs'>
										{lineaNegocioLabel}
									</Badge>
									<Badge
										variant={ESTADO_GENERAL_CLIENTE_BADGE[estadoCliente]}
										className='text-xs'
									>
										{ESTADO_GENERAL_CLIENTE_LABELS[estadoCliente]}
									</Badge>
									<EstadoCompletitudInformacion
										completa={prospecto.informacion_completa}
									/>
								</div>
								{esCondominio && (
									<div className='mt-2.5'>
										<AdministradorAsociado
											administrador={
												(prospecto as ProspectoCondominio).administrador
											}
										/>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Right: KPI summary */}
					<div className='grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:shrink-0 lg:grid-cols-2 xl:grid-cols-4'>
						<KpiSummaryCard
							icon={Shield}
							label='Pólizas vigentes'
							value={kpis.polizasVigentes}
							color='bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
						/>
						<KpiSummaryCard
							icon={TrendingUp}
							label='Prima vigente'
							value={`UF ${kpis.primaVigente}`}
							color='bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
						/>
						<KpiSummaryCard
							icon={CheckCircle2}
							label='Completitud'
							value={prospecto.informacion_completa ? '100%' : 'Incompleta'}
							color={
								prospecto.informacion_completa
									? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
									: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
							}
						/>
						<KpiSummaryCard
							icon={Users}
							label='Contactos'
							value={kpis.contactosCount}
							color='bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
