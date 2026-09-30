'use client'

import { ArrowRight, ClipboardList, FileText } from 'lucide-react'
import Link from 'next/link'

import { ObtenerProspectosResponse } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/obtener-prospectos-response'
import { Card, CardContent } from '@/components/card'
import CardCalendario from '@/components/card-calendario/card-calendario'
import CardComunicadoGerencia from '@/components/card-comunicado-gerencia/card-comunicado-gerencia'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import PanelCobranzaClient from '@/components/paneles/ejecutivo-cobranza/panel-cobranza-client'
import AlertasEjecutivo from '@/components/paneles/home/alertas-ejecutivo/alertas-ejecutivo'
import { DashboardCobranza } from '@/dominio/cobranza/dashboard-cobranza'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import MetricasEjecutivoComercial from '../ejecutivo-comercial/metricas-ejecutivo-comercial/metricas-ejecutivo-comercial'
import PanelFooter from '../panel-layout/panel-footer/panel-footer'
import PanelHeader from '../panel-layout/panel-header/panel-header'
import PanelLayout from '../panel-layout/panel-layout'

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

	const esEjecutivoCobranza = codigoRoles.includes('EJECUTIVO_COBRANZA')

	return (
		<PanelLayout>
			<PanelHeader>
				{/* Encabezado de bienvenida */}
				<div className='flex flex-col gap-4 md:flex-row md:justify-between'>
					<div className='flex flex-col gap-1'>
						<h1 className='text-xl font-semibold tracking-tight text-foreground sm:text-2xl'>
							Bienvenido
							{nombreUsuario ? `, ${nombreUsuario.split(' ')[0]}` : ''}
						</h1>
						<p className='text-sm text-muted-foreground'>
							Resumen de tu actividad comercial.
						</p>
					</div>
					<PermissionGuard allowedPermissions={['VER_METRICAS_EJECUTIVO']}>
						<MetricasEjecutivoComercial />
					</PermissionGuard>
				</div>

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
			</PanelHeader>

			{/* Pendientes del ejecutivo: alertas SLA agrupadas en críticas y avisos */}
			<PermissionGuard allowedPermissions={['VER_ALERTAS']}>
				<AlertasEjecutivo />
			</PermissionGuard>

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
