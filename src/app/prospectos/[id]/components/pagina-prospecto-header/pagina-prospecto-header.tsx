'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { Separator } from '@/components/separator'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import {
	ESTADO_GENERAL_CLIENTE_BADGE,
	ESTADO_GENERAL_CLIENTE_LABELS,
	type EstadoGeneralCliente,
} from '@/lib/estados-cotizaciones'
import {
	Briefcase,
	Building2,
	ClipboardCheck,
	DollarSign,
	RefreshCw,
	type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import AdministradorAsociado from './administrador-asociado/administrador-asociado'
import { AsignarEjecutivoDialog } from './asignar-ejecutivo-dialog'

type PaginaProspectoHeaderProps = {
	prospecto: Prospecto
}

type EjecutivoItemProps = {
	label: string
	icon: LucideIcon
	nombre?: string
	onClick: () => void
	allowedPermissions: string[]
}

const EjecutivoItem = ({
	label,
	icon: Icon,
	nombre,
	onClick,
	allowedPermissions,
}: EjecutivoItemProps) => {
	return (
		<div className='flex min-w-0 flex-col gap-3 overflow-hidden rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/60 sm:flex-row sm:items-center sm:gap-3'>
			<div className='flex min-w-0 flex-1 items-center gap-3'>
				<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-card text-muted-foreground shadow-xs'>
					<Icon className='h-4 w-4' aria-hidden />
				</div>
				<div className='min-w-0 flex-1 space-y-0.5'>
					<p className='truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
						{label}
					</p>
					<p className='truncate text-sm font-medium text-foreground'>
						{nombre ?? '—'}
					</p>
				</div>
			</div>
			<PermissionGuard allowedPermissions={allowedPermissions}>
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-7 w-full shrink-0 px-2.5 text-xs sm:w-auto'
					onClick={onClick}
				>
					{nombre ? 'Reasignar' : 'Asignar'}
				</Button>
			</PermissionGuard>
		</div>
	)
}

const PaginaProspectoHeader = ({ prospecto }: PaginaProspectoHeaderProps) => {
	const [openAsignarComercial, setOpenAsignarComercial] = useState(false)
	const [openAsignarEvaluacion, setOpenAsignarEvaluacion] = useState(false)
	const [openAsignarCobranza, setOpenAsignarCobranza] = useState(false)
	const [openAsignarRenovacion, setOpenAsignarRenovacion] = useState(false)

	const estadoCliente: EstadoGeneralCliente =
		(prospecto.estado_general_cliente as EstadoGeneralCliente) || 'prospecto'

	const esCondominio =
		prospecto.linea_negocio.nombre.toLowerCase() === 'condominio'
	const tieneCliente = Boolean(prospecto.id_cliente)

	const lineaNegocioLabel = prospecto.linea_negocio.nombre
		.replace(/_/g, ' ')
		.replace(/^\w/, c => c.toUpperCase())

	const ejecutivos = [
		{
			key: 'comercial',
			label: 'Gestión comercial',
			icon: Briefcase,
			nombre: prospecto.ejecutivo_comercial_asignado?.nombre,
			onClick: () => setOpenAsignarComercial(true),
			allowedPermissions: ['ASIGNAR_EJECUTIVO_COMERCIAL'],
		},
		{
			key: 'evaluacion',
			label: 'Evaluación técnica',
			icon: ClipboardCheck,
			nombre: prospecto.ejecutivo_evaluacion_asignado?.nombre,
			onClick: () => setOpenAsignarEvaluacion(true),
			allowedPermissions: ['ASIGNAR_EJECUTIVO_EVALUACION'],
		},
		...(tieneCliente
			? [
					{
						key: 'cobranza',
						label: 'Cobranza',
						icon: DollarSign,
						nombre: prospecto.ejecutivo_cobranza_asignado?.nombre,
						onClick: () => setOpenAsignarCobranza(true),
						allowedPermissions: ['ASIGNAR_EJECUTIVO_COBRANZA'],
					},
					{
						key: 'renovacion',
						label: 'Renovación',
						icon: RefreshCw,
						nombre: prospecto.ejecutivo_renovacion_asignado?.nombre,
						onClick: () => setOpenAsignarRenovacion(true),
						allowedPermissions: ['ASIGNAR_EJECUTIVO_RENOVACION'],
					},
				]
			: []),
	]

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardContent className='p-4 sm:p-5 lg:p-6'>
				<div className='flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8'>
					<div className='min-w-0 flex-1 space-y-5'>
						<div className='flex items-start gap-3 sm:gap-4'>
							<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12'>
								<Building2 className='h-5 w-5 sm:h-6 sm:w-6' aria-hidden />
							</div>
							<div className='min-w-0 flex-1 pt-0.5'>
								<h1 className='text-lg font-bold leading-snug tracking-tight wrap-break-words text-foreground sm:text-xl lg:text-2xl'>
									{prospecto.nombre_riesgo}
								</h1>
								<div className='mt-1.5 space-y-2'>
									<Badge variant='secondary'>{lineaNegocioLabel}</Badge>
									{esCondominio && (
										<div className='w-fit rounded-lg bg-muted/40 px-2.5 py-1.5'>
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

						<Separator />

						<div>
							<h2 className='mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
								Ejecutivos asignados
							</h2>
							<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2'>
								{ejecutivos.map(ejecutivo => (
									<EjecutivoItem
										key={ejecutivo.key}
										label={ejecutivo.label}
										icon={ejecutivo.icon}
										nombre={ejecutivo.nombre}
										onClick={ejecutivo.onClick}
										allowedPermissions={ejecutivo.allowedPermissions}
									/>
								))}
							</div>
						</div>
					</div>

					<Separator
						orientation='vertical'
						className='hidden self-stretch lg:block'
					/>

					<div className='flex flex-col gap-3 lg:w-64 lg:shrink-0'>
						<div className='flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3 sm:p-4 lg:flex-col lg:items-start lg:gap-2'>
							<span className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
								Estado general del prospecto
							</span>
							<Badge variant={ESTADO_GENERAL_CLIENTE_BADGE[estadoCliente]}>
								{ESTADO_GENERAL_CLIENTE_LABELS[estadoCliente]}
							</Badge>
						</div>
						<div className='flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3 sm:p-4 lg:flex-col lg:items-start lg:gap-2'>
							<span className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
								Estado de la información
							</span>
							<EstadoCompletitudInformacion
								completa={prospecto.informacion_completa}
							/>
						</div>
					</div>
				</div>
			</CardContent>

			<PermissionGuard allowedPermissions={['ASIGNAR_EJECUTIVO_COMERCIAL']}>
				<AsignarEjecutivoDialog
					open={openAsignarComercial}
					onOpenChange={setOpenAsignarComercial}
					idProspecto={prospecto.id}
					tipo='comercial'
					ejecutivoActual={prospecto.ejecutivo_comercial_asignado?.rut}
				/>
			</PermissionGuard>

			<PermissionGuard allowedPermissions={['ASIGNAR_EJECUTIVO_EVALUACION']}>
				<AsignarEjecutivoDialog
					open={openAsignarEvaluacion}
					onOpenChange={setOpenAsignarEvaluacion}
					idProspecto={prospecto.id}
					tipo='evaluacion'
					ejecutivoActual={prospecto.ejecutivo_evaluacion_asignado?.rut}
				/>
			</PermissionGuard>

			{tieneCliente && (
				<>
					<PermissionGuard allowedPermissions={['ASIGNAR_EJECUTIVO_COBRANZA']}>
						<AsignarEjecutivoDialog
							open={openAsignarCobranza}
							onOpenChange={setOpenAsignarCobranza}
							idProspecto={prospecto.id}
							idCliente={prospecto.id_cliente}
							tipo='cobranza'
							ejecutivoActual={prospecto.ejecutivo_cobranza_asignado?.rut}
						/>
					</PermissionGuard>

					<PermissionGuard
						allowedPermissions={['ASIGNAR_EJECUTIVO_RENOVACION']}
					>
						<AsignarEjecutivoDialog
							open={openAsignarRenovacion}
							onOpenChange={setOpenAsignarRenovacion}
							idProspecto={prospecto.id}
							idCliente={prospecto.id_cliente}
							tipo='renovacion'
							ejecutivoActual={prospecto.ejecutivo_renovacion_asignado?.rut}
						/>
					</PermissionGuard>
				</>
			)}
		</Card>
	)
}

export default PaginaProspectoHeader
