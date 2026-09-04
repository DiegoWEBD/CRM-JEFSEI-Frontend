'use client'

import {
	ClipboardList,
	FileText,
	UserCheck,
	Users,
	Upload,
	RefreshCw,
	Bell,
} from 'lucide-react'
import Link from 'next/link'

import CardCalendario from '@/components/card-calendario/card-calendario'
import CardComunicadoGerencia from '@/components/card-comunicado-gerencia/card-comunicado-gerencia'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import PanelCobranzaClient from '@/components/paneles/ejecutivo-cobranza/panel-cobranza-client'
import { DashboardCobranza } from '@/dominio/cobranza/dashboard-cobranza'
import { useFiltrosProspectos } from '@/hooks/prospectos/use-filtros-prospectos'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import MetricasEjecutivoComercial from '../ejecutivo-comercial/metricas-ejecutivo-comercial/metricas-ejecutivo-comercial'
import PanelFooter from '../panel-layout/panel-footer/panel-footer'
import PanelHeader from '../panel-layout/panel-header/panel-header'
import PanelLayout from '../panel-layout/panel-layout'
import { PanelKpiCard } from '../shared/panel-kpi-card'
import PanelKpiContainer from '../shared/panel-kpi-container/panel-kpi-container'
import AlertasEjecutivo from './alertas-ejecutivo'

type PanelHomeClientProps = {
	codigoRoles: string[]
	nombreUsuario: string
	dashboardCobranzaInicial?: DashboardCobranza
}

export default function PanelHomeClient({
	codigoRoles,
	nombreUsuario,
	dashboardCobranzaInicial,
}: PanelHomeClientProps) {
	const { data } = useObtenerProspectos(
		null,
		'',
		1,
		10,
		null,
		null,
		null,
	)

	const prospectos = data?.data ?? []

	const esEjecutivoCobranza = codigoRoles.includes('EJECUTIVO_COBRANZA')

	const { contadores: filtrosContados } = useFiltrosProspectos(
		data?.contadores_estado,
	)

	const totalProspectos = filtrosContados.get('prospecto') ?? 0
	const clientesActivos = filtrosContados.get('cliente_activo') ?? 0
	const clientesInactivos = filtrosContados.get('cliente_inactivo') ?? 0
	const cotizacionesSolicitadas = filtrosContados.get('COTIZACION_SOLICITADA_COMPANY') ?? 0
	const estudiosDisponibles = filtrosContados.get('ESTUDIO_DISPONIBLE') ?? 0

	return (
		<PanelLayout>
			<PanelHeader>
				<div className='flex flex-col gap-1'>
					<h1 className='text-xl font-semibold tracking-tight text-foreground sm:text-2xl'>
						Bienvenido{nombreUsuario ? `, ${nombreUsuario.split(' ')[0]}` : ''}
					</h1>
					<p className='text-sm text-muted-foreground'>
						Resumen de tu actividad comercial.
					</p>
				</div>

				<>
					<PermissionGuard allowedPermissions={['VER_METRICAS_EJECUTIVO']}>
						<MetricasEjecutivoComercial />
					</PermissionGuard>

					<PanelKpiContainer className='xl:grid-cols-6'>
						<AuthGuard
							fallback={null}
							allowedRoles={[
								'EJECUTIVO_COMERCIAL',
								'GERENTE_GENERAL',
								'GERENTE_COMERCIAL',
								'GERENTE_OPERACIONES',
							]}
						>
							<Link href='/prospectos?filtro=prospecto' className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
								<PanelKpiCard
									label='Prospectos'
									value={totalProspectos}
									icon={UserCheck}
									accent='warning'
								/>
							</Link>

							<Link href='/prospectos?filtro=cliente_activo' className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
								<PanelKpiCard
									label='Clientes activos'
									value={clientesActivos}
									icon={Users}
									accent='success'
								/>
							</Link>

							<Link href='/prospectos?filtro=cliente_inactivo' className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
								<PanelKpiCard
									label='Clientes inactivos'
									value={clientesInactivos}
									icon={Users}
									accent='danger'
								/>
							</Link>

							<AuthGuard fallback={null} allowedRoles={['EJECUTIVO_COMERCIAL']}>
								<Link href='/prospectos?filtro=COTIZACION_SOLICITADA_COMPANY' className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
									<PanelKpiCard
										label='Cotizaciones solicitadas'
										value={cotizacionesSolicitadas}
										icon={ClipboardList}
										accent='info'
									/>
								</Link>
								<Link href='/prospectos?filtro=ESTUDIO_DISPONIBLE' className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
									<PanelKpiCard
										label='Estudios disponibles'
										value={estudiosDisponibles}
										icon={FileText}
										accent='info'
									/>
								</Link>
							</AuthGuard>

							<Link href='/prospectos?filtro=todos' className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
								<PanelKpiCard
									label='En seguimiento'
									value={totalProspectos}
									icon={RefreshCw}
									accent='primary'
								/>
							</Link>
						</AuthGuard>

						<AuthGuard
							fallback={null}
							allowedRoles={['EJECUTIVO_EVALUACION_PROYECTOS']}
						>
							<Link href='/prospectos?filtro=COTIZACION_SOLICITADA_COMPANY' className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
								<PanelKpiCard
									label='Cotizaciones pendientes'
									value={cotizacionesSolicitadas}
									icon={Bell}
									accent='warning'
								/>
							</Link>
							<Link href='/prospectos?filtro=RECOTIZACION_SOLICITADA' className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
								<PanelKpiCard
									label='Recotizaciones pendientes'
									value={filtrosContados.get('RECOTIZACION_SOLICITADA') ?? 0}
									icon={RefreshCw}
									accent='primary'
								/>
							</Link>
							<Link href='/prospectos?filtro=COTIZACION_DISPONIBLE' className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
								<PanelKpiCard
									label='Estudios por generar'
									value={filtrosContados.get('COTIZACION_DISPONIBLE') ?? 0}
									icon={Upload}
									accent='info'
								/>
							</Link>
						</AuthGuard>
					</PanelKpiContainer>

					<AlertasEjecutivo />

					{esEjecutivoCobranza && (
						<PanelCobranzaClient dashboardInicial={dashboardCobranzaInicial} />
					)}
				</>
			</PanelHeader>

			<CardCalendario prospectos={prospectos} />

			<PanelFooter>
				<CardComunicadoGerencia />
			</PanelFooter>
		</PanelLayout>
	)
}
