'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import {
	ESTADO_GENERAL_CLIENTE_BADGE,
	ESTADO_GENERAL_CLIENTE_LABELS,
	type EstadoGeneralCliente,
} from '@/lib/estados-cotizaciones'
import { Building2 } from 'lucide-react'
import { useState } from 'react'
import AdministradorAsociado from './administrador-asociado/administrador-asociado'
import { AsignarEjecutivoDialog } from './asignar-ejecutivo-dialog'
import AuthGuard from '@/components/layouts/guards/auth-guard'

type PaginaProspectoHeaderProps = {
	prospecto: Prospecto
}

const PaginaProspectoHeader = ({ prospecto }: PaginaProspectoHeaderProps) => {
	const [openAsignarComercial, setOpenAsignarComercial] = useState(false)
	const [openAsignarEvaluacion, setOpenAsignarEvaluacion] = useState(false)
	const [openAsignarCobranza, setOpenAsignarCobranza] = useState(false)
	const [openAsignarRenovacion, setOpenAsignarRenovacion] = useState(false)

	const estadoCliente: EstadoGeneralCliente =
		(prospecto.estado_general_cliente as EstadoGeneralCliente) || 'prospecto'

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardContent className='p-4 sm:p-5'>
				<div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
					<div className='min-w-0 space-y-3'>
						<div className='flex flex-wrap items-center gap-2'>
							<Building2
								className='h-5 w-5 shrink-0 text-muted-foreground'
								aria-hidden
							/>
							<h1 className='truncate text-base font-semibold leading-tight text-foreground sm:text-lg lg:text-xl'>
								{prospecto.nombre_riesgo}
							</h1>
						</div>
						{prospecto.linea_negocio.nombre.toLowerCase() == 'condominio' && (
							<AdministradorAsociado
								administrador={(prospecto as ProspectoCondominio).administrador}
							/>
						)}
						<div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
							<span>
								<span className='text-muted-foreground'>
									Gestión comercial:
								</span>{' '}
								<span className='font-medium text-foreground'>
									{prospecto.ejecutivo_comercial_asignado?.nombre ?? '—'}
								</span>
							</span>
							<AuthGuard
								allowedRoles={[
									'GERENTE_GENERAL',
									'GERENTE_COMERCIAL',
									'GERENTE_OPERACIONES',
								]}
								fallback={null}
							>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									className='ml-1 h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground'
									onClick={() => setOpenAsignarComercial(true)}
								>
									{prospecto.ejecutivo_comercial_asignado
										? 'Reasignar'
										: 'Asignar'}
								</Button>
							</AuthGuard>
						</div>
						<div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
							<span>
								<span className='text-muted-foreground'>
									Evaluación técnica:
								</span>{' '}
								<span className='font-medium text-foreground'>
									{prospecto.ejecutivo_evaluacion_asignado?.nombre ?? '—'}
								</span>
							</span>
							<AuthGuard
								allowedRoles={[
									'GERENTE_GENERAL',
									'GERENTE_COMERCIAL',
									'GERENTE_OPERACIONES',
								]}
								fallback={null}
							>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									className='ml-1 h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground'
									onClick={() => setOpenAsignarEvaluacion(true)}
								>
									{prospecto.ejecutivo_evaluacion_asignado
										? 'Reasignar'
										: 'Asignar'}
								</Button>
							</AuthGuard>
						</div>
						{prospecto.id_cliente && (
							<>
								<div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
									<span>
										<span className='text-muted-foreground'>Cobranza:</span>{' '}
										<span className='font-medium text-foreground'>
											{prospecto.ejecutivo_cobranza_asignado?.nombre ?? '—'}
										</span>
									</span>
									<AuthGuard
										allowedRoles={[
											'GERENTE_GENERAL',
											'GERENTE_COMERCIAL',
											'GERENTE_OPERACIONES',
										]}
										fallback={null}
									>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											className='ml-1 h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground'
											onClick={() => setOpenAsignarCobranza(true)}
										>
											{prospecto.ejecutivo_cobranza_asignado
												? 'Reasignar'
												: 'Asignar'}
										</Button>
									</AuthGuard>
								</div>
								<div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
									<span>
										<span className='text-muted-foreground'>Renovación:</span>{' '}
										<span className='font-medium text-foreground'>
											{prospecto.ejecutivo_renovacion_asignado?.nombre ?? '—'}
										</span>
									</span>
									<AuthGuard
										allowedRoles={[
											'GERENTE_GENERAL',
											'GERENTE_COMERCIAL',
											'GERENTE_OPERACIONES',
										]}
										fallback={null}
									>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											className='ml-1 h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground'
											onClick={() => setOpenAsignarRenovacion(true)}
										>
											{prospecto.ejecutivo_renovacion_asignado
												? 'Reasignar'
												: 'Asignar'}
										</Button>
									</AuthGuard>
								</div>
							</>
						)}
					</div>
					<div className='flex flex-col gap-3 sm:flex-row sm:gap-6 lg:flex-col lg:items-end lg:gap-3 lg:pt-0.5'>
						<div className='flex flex-col items-start gap-1.5 lg:items-end'>
							<span className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
								Estado general del prospecto
							</span>
							<div className='flex flex-wrap items-center gap-2'>
								<Badge variant={ESTADO_GENERAL_CLIENTE_BADGE[estadoCliente]}>
									{ESTADO_GENERAL_CLIENTE_LABELS[estadoCliente]}
								</Badge>
							</div>
						</div>
						<div className='flex flex-col items-start gap-1.5 lg:items-end'>
							<span className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
								Estado de la información
							</span>
							<EstadoCompletitudInformacion
								completa={prospecto.informacion_completa}
							/>
						</div>
					</div>
				</div>
			</CardContent>
			<AuthGuard
				allowedRoles={[
					'GERENTE_GENERAL',
					'GERENTE_COMERCIAL',
					'GERENTE_OPERACIONES',
				]}
				fallback={null}
			>
				<AsignarEjecutivoDialog
					open={openAsignarComercial}
					onOpenChange={setOpenAsignarComercial}
					idProspecto={prospecto.id}
					tipo='comercial'
					ejecutivoActual={prospecto.ejecutivo_comercial_asignado?.rut}
				/>
			</AuthGuard>

			<AuthGuard
				allowedRoles={[
					'GERENTE_GENERAL',
					'GERENTE_COMERCIAL',
					'GERENTE_OPERACIONES',
				]}
				fallback={null}
			>
				<AsignarEjecutivoDialog
					open={openAsignarEvaluacion}
					onOpenChange={setOpenAsignarEvaluacion}
					idProspecto={prospecto.id}
					tipo='evaluacion'
					ejecutivoActual={prospecto.ejecutivo_evaluacion_asignado?.rut}
				/>
			</AuthGuard>

			{prospecto.id_cliente && (
				<>
					<AuthGuard
						allowedRoles={[
							'GERENTE_GENERAL',
							'GERENTE_COMERCIAL',
							'GERENTE_OPERACIONES',
						]}
						fallback={null}
					>
						<AsignarEjecutivoDialog
							open={openAsignarCobranza}
							onOpenChange={setOpenAsignarCobranza}
							idProspecto={prospecto.id}
							idCliente={prospecto.id_cliente}
							tipo='cobranza'
							ejecutivoActual={prospecto.ejecutivo_cobranza_asignado?.rut}
						/>
					</AuthGuard>

					<AuthGuard
						allowedRoles={[
							'GERENTE_GENERAL',
							'GERENTE_COMERCIAL',
							'GERENTE_OPERACIONES',
						]}
						fallback={null}
					>
						<AsignarEjecutivoDialog
							open={openAsignarRenovacion}
							onOpenChange={setOpenAsignarRenovacion}
							idProspecto={prospecto.id}
							idCliente={prospecto.id_cliente}
							tipo='renovacion'
							ejecutivoActual={prospecto.ejecutivo_renovacion_asignado?.rut}
						/>
					</AuthGuard>
				</>
			)}
		</Card>
	)
}

export default PaginaProspectoHeader
