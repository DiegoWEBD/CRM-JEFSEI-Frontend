'use client'

import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import {
	Briefcase,
	ClipboardCheck,
	DollarSign,
	RefreshCw,
	type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { AsignarEjecutivoDialog } from '../pagina-prospecto-header/asignar-ejecutivo-dialog'

type EjecutivosAsignadosCardProps = {
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
		<div className='flex min-w-0 flex-col gap-2.5 rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/40'>
			<div className='flex min-w-0 flex-1 items-center gap-2.5'>
				<div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-card text-muted-foreground shadow-xs'>
					<Icon className='h-4 w-4' aria-hidden />
				</div>
				<div className='min-w-0 flex-1'>
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
					className='h-7 w-full px-2.5 text-xs'
					onClick={onClick}
				>
					{nombre ? 'Reasignar' : 'Asignar'}
				</Button>
			</PermissionGuard>
		</div>
	)
}

export default function EjecutivosAsignadosCard({
	prospecto,
}: EjecutivosAsignadosCardProps) {
	const [openAsignarComercial, setOpenAsignarComercial] = useState(false)
	const [openAsignarEvaluacion, setOpenAsignarEvaluacion] = useState(false)
	const [openAsignarCobranza, setOpenAsignarCobranza] = useState(false)
	const [openAsignarRenovacion, setOpenAsignarRenovacion] = useState(false)

	const tieneCliente = Boolean(prospecto.id_cliente)

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
		<>
			<Card className='border-border bg-card shadow-none'>
				<CardHeader className='border-b border-border pb-2 pt-3'>
					<CardTitle primary>Ejecutivos asignados</CardTitle>
				</CardHeader>
				<CardContent className='p-4'>
					<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4'>
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
				</CardContent>
			</Card>

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
		</>
	)
}
