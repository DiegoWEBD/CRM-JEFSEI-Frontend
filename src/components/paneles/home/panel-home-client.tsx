'use client'

import {
	ArrowRight,
	Bell,
	ClipboardList,
	FileText,
	RefreshCw,
	Upload,
	UserCheck,
	Users,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { ObtenerProspectosResponse } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/obtener-prospectos-response'
import { Card, CardContent } from '@/components/card'
import CardCalendario from '@/components/card-calendario/card-calendario'
import CardComunicadoGerencia from '@/components/card-comunicado-gerencia/card-comunicado-gerencia'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import PanelCobranzaClient from '@/components/paneles/ejecutivo-cobranza/panel-cobranza-client'
import { DashboardCobranza } from '@/dominio/cobranza/dashboard-cobranza'
import { useFiltrosProspectos } from '@/hooks/prospectos/use-filtros-prospectos'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import CardProspectosClient from '../../prospectos/card-prospectos/card-prospectos-client'
import MetricasEjecutivoComercial from '../ejecutivo-comercial/metricas-ejecutivo-comercial/metricas-ejecutivo-comercial'
import PanelFooter from '../panel-layout/panel-footer/panel-footer'
import PanelHeader from '../panel-layout/panel-header/panel-header'
import PanelLayout from '../panel-layout/panel-layout'
import { PanelKpiCard } from '../shared/panel-kpi-card'
import PanelKpiContainer from '../shared/panel-kpi-container/panel-kpi-container'

type PanelHomeClientProps = {
	prospectosIniciales: ObtenerProspectosResponse
	codigoRoles: string[]
	nombreUsuario: string
	dashboardCobranzaInicial?: DashboardCobranza
}

export default function PanelHomeClient({
	prospectosIniciales,
	codigoRoles,
	nombreUsuario,
	dashboardCobranzaInicial,
}: PanelHomeClientProps) {
	const { data } = useObtenerProspectos(
		prospectosIniciales,
		null,
		'',
		1,
		10,
		null,
		null,
		null,
	)

	const response = data ?? prospectosIniciales
	const prospectos = response.data

	const [filtroHome, setFiltroHome] = useState<string>('todos')

	const esEjecutivoCobranza = codigoRoles.includes('EJECUTIVO_COBRANZA')

	const { contadores: filtrosContados } = useFiltrosProspectos(
		response.contadores_estado,
	)

	const KPI_FILTRO: Record<string, string> = useMemo(
		() => ({
			prospectos: 'prospecto',
			asignados: 'todos',
			activos: 'cliente_activo',
			inactivos: 'cliente_inactivo',
			cotiz: 'COTIZACION_SOLICITADA_COMPANY',
			estDisp: 'ESTUDIO_DISPONIBLE',
			pendRevision: 'COTIZACION_SOLICITADA_COMPANY',
			infoCompleta: 'todos',
			recotizaciones: 'RECOTIZACION_SOLICITADA',
			estXGenerar: 'COTIZACION_DISPONIBLE',
		}),
		[],
	)

	const onKpiClick = (key: string) => {
		const filtro = KPI_FILTRO[key]
		if (!filtro) return
		setFiltroHome(prev => (prev === filtro ? 'todos' : filtro))
	}

	const totalProspectos = filtrosContados.get('prospecto') ?? 0
	const clientesActivos = filtrosContados.get('cliente_activo') ?? 0
	const clientesInactivos = filtrosContados.get('cliente_inactivo') ?? 0

	return (
		<PanelLayout>
			<PanelHeader>
				{/* Encabezado de bienvenida */}
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

					<PanelKpiContainer>
						<AuthGuard
							fallback={null}
							allowedRoles={[
								'EJECUTIVO_COMERCIAL',
								'GERENTE_GENERAL',
								'GERENTE_COMERCIAL',
								'GERENTE_OPERACIONES',
							]}
						>
							<PanelKpiCard
								key='prospectos'
								label='Prospectos'
								value={totalProspectos}
								icon={UserCheck}
								onClick={() => onKpiClick('prospectos')}
								activa={filtroHome === 'prospecto'}
								accent='warning'
							/>

							<PanelKpiCard
								key='activos'
								label='Clientes activos'
								value={clientesActivos}
								icon={Users}
								onClick={() => onKpiClick('activos')}
								activa={filtroHome === 'cliente_activo'}
								accent='success'
							/>

							<PanelKpiCard
								key='inactivos'
								label='Clientes inactivos'
								value={clientesInactivos}
								icon={Users}
								onClick={() => onKpiClick('inactivos')}
								activa={filtroHome === 'cliente_inactivo'}
								accent='danger'
							/>

							<AuthGuard fallback={null} allowedRoles={['EJECUTIVO_COMERCIAL']}>
								<PanelKpiCard
									key='cotiz'
									label='Cotizaciones solicitadas'
									value={
										filtrosContados.get('COTIZACION_SOLICITADA_COMPANY') ?? 0
									}
									icon={ClipboardList}
									onClick={() => onKpiClick('cotiz')}
									activa={filtroHome === 'COTIZACION_SOLICITADA_COMPANY'}
								/>
								<PanelKpiCard
									key='estDisp'
									label='Estudios disponibles'
									value={filtrosContados.get('ESTUDIO_DISPONIBLE') ?? 0}
									icon={FileText}
									onClick={() => onKpiClick('estDisp')}
									activa={filtroHome === 'ESTUDIO_DISPONIBLE'}
								/>
							</AuthGuard>
						</AuthGuard>

						<AuthGuard
							fallback={null}
							allowedRoles={['EJECUTIVO_EVALUACION_PROYECTOS']}
						>
							<PanelKpiCard
								key='pendRevision'
								label='Cotizaciones pendientes'
								value={
									filtrosContados.get('COTIZACION_SOLICITADA_COMPANY') ?? 0
								}
								icon={Bell}
								onClick={() => onKpiClick('pendRevision')}
								activa={filtroHome === 'COTIZACION_SOLICITADA_COMPANY'}
								accent='warning'
							/>
							<PanelKpiCard
								key='infoCompleta'
								label='Información completa'
								value={0}
								icon={ClipboardList}
								onClick={() => onKpiClick('infoCompleta')}
								activa={false}
								accent='success'
							/>
							<PanelKpiCard
								key='recotizaciones'
								label='Recotizaciones pendientes'
								value={filtrosContados.get('RECOTIZACION_SOLICITADA') ?? 0}
								icon={RefreshCw}
								onClick={() => onKpiClick('recotizaciones')}
								activa={filtroHome === 'RECOTIZACION_SOLICITADA'}
								accent='primary'
							/>
							<PanelKpiCard
								key='estXGenerar'
								label='Estudios por generar'
								value={filtrosContados.get('COTIZACION_DISPONIBLE') ?? 0}
								icon={Upload}
								onClick={() => onKpiClick('estXGenerar')}
								activa={filtroHome === 'COTIZACION_DISPONIBLE'}
								accent='info'
							/>
						</AuthGuard>
					</PanelKpiContainer>
				</>

				<AuthGuard
					fallback={null}
					allowedRoles={['EJECUTIVO_EVALUACION_PROYECTOS']}
				>
					<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
						<TarjetaEnlace
							href='/solicitudes-estudio'
							icono={ClipboardList}
							titulo='Solicitudes de estudio'
							descripcion='Revisa y gestiona las solicitudes de cotización'
						/>
						<TarjetaEnlace
							href='/cotizaciones-estudios-emitidos'
							icono={FileText}
							titulo='Cotizaciones / estudios emitidos'
							descripcion='Historial de cotizaciones y estudios emitidos'
						/>
					</div>
				</AuthGuard>

				{esEjecutivoCobranza && (
					<PanelCobranzaClient dashboardInicial={dashboardCobranzaInicial} />
				)}

				{!esEjecutivoCobranza && (
					<CardProspectosClient
						initialData={response}
						filtroExterno={filtroHome}
						onFiltroChange={setFiltroHome}
					/>
				)}
			</PanelHeader>

			<CardCalendario prospectos={prospectos} />

			<PanelFooter>
				<CardComunicadoGerencia />
			</PanelFooter>
		</PanelLayout>
	)
}

function TarjetaEnlace({
	href,
	icono: Icono,
	titulo,
	descripcion,
}: {
	href: string
	icono: React.ComponentType<{ className?: string }>
	titulo: string
	descripcion: string
}) {
	return (
		<Link
			href={href}
			className='group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
		>
			<Card className='border-border/70 bg-card shadow-none transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md'>
				<CardContent className='flex items-center gap-3.5 p-4'>
					<span className='grid size-11 shrink-0 place-items-center rounded-xl bg-primary/6 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/10'>
						<Icono className='size-5' aria-hidden />
					</span>
					<div className='min-w-0 flex-1'>
						<h2 className='text-sm font-semibold leading-snug text-foreground sm:text-base'>
							{titulo}
						</h2>
						<p className='mt-0.5 text-xs leading-snug text-muted-foreground'>
							{descripcion}
						</p>
					</div>
					<ArrowRight
						className='size-4 shrink-0 text-primary opacity-70 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 sm:size-5'
						aria-hidden
					/>
				</CardContent>
			</Card>
		</Link>
	)
}
