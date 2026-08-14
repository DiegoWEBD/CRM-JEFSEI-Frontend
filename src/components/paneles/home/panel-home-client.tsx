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

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { Card, CardContent } from '@/components/card'
import CardCalendario from '@/components/card-calendario/card-calendario'
import CardComunicadoGerencia from '@/components/card-comunicado-gerencia/card-comunicado-gerencia'
import {
	FiltroEstadoValor,
	useFiltrarProspectos,
} from '@/hooks/prospectos/use-filtrar-prospectos'
import { useFiltrosProspectos } from '@/hooks/prospectos/use-filtros-prospectos'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import { DashboardCobranza } from '@/dominio/cobranza/dashboard-cobranza'
import PanelCobranzaClient from '@/components/paneles/ejecutivo-cobranza/panel-cobranza-client'
import CardProspectosClient from '../../prospectos/card-prospectos/card-prospectos-client'
import CardKpi from '../ejecutivo-comercial/cards/card-kpi/card-kpi'
import MetricasEjecutivoComercial from '../ejecutivo-comercial/metricas-ejecutivo-comercial/metricas-ejecutivo-comercial'
import SheetClientesFiltrados from '../ejecutivo-comercial/sheet-clientes-filtrados'
import PanelFooter from '../panel-layout/panel-footer/panel-footer'
import PanelHeader from '../panel-layout/panel-header/panel-header'
import PanelLayout from '../panel-layout/panel-layout'

const Acentos = {
	info: { card: 'border-info/30 bg-info/[0.06]', icon: 'text-info' },
	success: { card: 'border-success/30 bg-success/[0.06]', icon: 'text-success' },
	primary: { card: 'border-primary/30 bg-primary/[0.06]', icon: 'text-primary' },
	warning: { card: 'border-warning/35 bg-warning/10', icon: 'text-warning-foreground dark:text-warning' },
	danger: { card: 'border-destructive/30 bg-destructive/[0.06]', icon: 'text-destructive' },
} as const

type PanelHomeClientProps = {
	prospectosIniciales: ProspectoResumenJson[]
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
	const { data: prospectos } = useObtenerProspectos(prospectosIniciales)

	const [kpiAbierto, setKpiAbierto] = useState<string | null>(null)

	const esEjecutivoComercial = codigoRoles.includes('EJECUTIVO_COMERCIAL')
	const esEjecutivoEvaluacion = codigoRoles.includes(
		'EJECUTIVO_EVALUACION_PROYECTOS',
	)
	const esEjecutivoCobranza = codigoRoles.includes('EJECUTIVO_COBRANZA')

	const { filtrosContados } = useFiltrosProspectos(prospectos)
	const { filtrar } = useFiltrarProspectos(prospectos)

	const KPI_FILTRO: Record<string, FiltroEstadoValor> = useMemo(
		() => ({
			asignados: 'todos',
			activos: 'todos',
			cotiz: 'COTIZACION_SOLICITADA_COMPANY',
			estDisp: 'ESTUDIO_DISPONIBLE',
			pendRevision: 'COTIZACION_SOLICITADA_COMPANY',
			infoCompleta: 'todos',
			recotizaciones: 'RECOTIZACION_SOLICITADA',
			estXGenerar: 'COTIZACION_DISPONIBLE',
		}),
		[],
	)

	const KPI_TITULOS: Record<string, string> = {
		asignados: 'Clientes asignados',
		activos: 'Clientes activos',
		cotiz: 'Cotizaciones solicitadas',
		estDisp: 'Estudios disponibles',
		pendRevision: 'Pendientes de revisión',
		infoCompleta: 'Información completa',
		recotizaciones: 'Recotizaciones pendientes',
		estXGenerar: 'Estudios por generar',
	}

	const prospectosSheet = useMemo(
		() => filtrar(KPI_FILTRO[kpiAbierto ?? '']),
		[kpiAbierto, filtrar, KPI_FILTRO],
	)

	const tituloSheet = kpiAbierto ? (KPI_TITULOS[kpiAbierto] ?? '') : ''

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

				{esEjecutivoComercial && (
					<>
						<MetricasEjecutivoComercial />
						<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
							<CardKpi
								datos={{
									key: 'asignados',
									label: 'Clientes asignados',
									value: prospectos?.length ?? 0,
									icon: UserCheck,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName={Acentos.info.card}
								iconClassName={Acentos.info.icon}
							/>
							<CardKpi
								datos={{
									key: 'cotiz',
									label: 'Cotizaciones solicitadas',
									value:
										filtrosContados.get('COTIZACION_SOLICITADA_COMPANY') ?? 0,
									icon: ClipboardList,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName={Acentos.success.card}
								iconClassName={Acentos.success.icon}
							/>
							<CardKpi
								datos={{
									key: 'estDisp',
									label: 'Estudios disponibles',
									value: filtrosContados.get('ESTUDIO_DISPONIBLE') ?? 0,
									icon: FileText,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName={Acentos.primary.card}
								iconClassName={Acentos.primary.icon}
							/>
							<CardKpi
								datos={{
									key: 'activos',
									label: 'Clientes activos',
									value:
										prospectos?.filter(
											prospecto =>
												prospecto.estado_general_cliente == 'cliente_activo',
										).length ?? 0,
									icon: Users,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName={Acentos.warning.card}
								iconClassName={Acentos.warning.icon}
							/>
						</div>
					</>
				)}

				{esEjecutivoEvaluacion && (
					<>
						<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
							<CardKpi
								datos={{
									key: 'pendRevision',
									label: 'Pendientes de revisión',
									value:
										filtrosContados.get('COTIZACION_SOLICITADA_COMPANY') ?? 0,
									icon: Bell,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName={Acentos.danger.card}
								iconClassName={Acentos.danger.icon}
							/>
							<CardKpi
								datos={{
									key: 'infoCompleta',
									label: 'Información completa',
									value: 0,
									icon: ClipboardList,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName={Acentos.success.card}
								iconClassName={Acentos.success.icon}
							/>
							<CardKpi
								datos={{
									key: 'recotizaciones',
									label: 'Recotizaciones pendientes',
									value: filtrosContados.get('RECOTIZACION_SOLICITADA') ?? 0,
									icon: RefreshCw,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName={Acentos.warning.card}
								iconClassName={Acentos.warning.icon}
							/>
							<CardKpi
								datos={{
									key: 'estXGenerar',
									label: 'Estudios por generar',
									value: filtrosContados.get('COTIZACION_DISPONIBLE') ?? 0,
									icon: Upload,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName={Acentos.info.card}
								iconClassName={Acentos.info.icon}
							/>
						</div>

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
					</>
				)}

				{esEjecutivoCobranza && (
					<PanelCobranzaClient dashboardInicial={dashboardCobranzaInicial} />
				)}

				{!esEjecutivoCobranza && (
					<CardProspectosClient prospectos={prospectos} />
				)}
			</PanelHeader>

			<CardCalendario prospectos={prospectos} />

			<PanelFooter>
				<CardComunicadoGerencia />
			</PanelFooter>

			<SheetClientesFiltrados
				prospectos={prospectosSheet}
				titulo={tituloSheet}
				abierto={kpiAbierto != null}
				onOpenChange={open => {
					if (!open) setKpiAbierto(null)
				}}
			/>
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
					<span className='grid size-11 shrink-0 place-items-center rounded-xl bg-primary/[0.06] text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/10'>
						<Icono className='size-5' aria-hidden />
					</span>
					<div className='min-w-0 flex-1'>
						<h2 className='text-sm font-semibold leading-snug text-foreground sm:text-[15px]'>
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