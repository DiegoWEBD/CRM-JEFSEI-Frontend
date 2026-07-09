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

type PanelHomeClientProps = {
	prospectosIniciales: ProspectoResumenJson[]
	codigoRoles: string[]
	dashboardCobranzaInicial?: DashboardCobranza
}

export default function PanelHomeClient({
	prospectosIniciales,
	codigoRoles,
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
				{esEjecutivoComercial && (
					<>
						<MetricasEjecutivoComercial />
						<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4'>
							<CardKpi
								datos={{
									key: 'asignados',
									label: 'Clientes asignados',
									value: prospectos?.length ?? 0,
									icon: UserCheck,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName='border-sky-500/35 bg-sky-500/[0.06]'
								iconClassName='text-sky-600 dark:text-sky-400'
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
								accentClassName='border-emerald-500/30 bg-emerald-500/[0.05]'
								iconClassName='text-emerald-600 dark:text-emerald-400'
							/>
							<CardKpi
								datos={{
									key: 'estDisp',
									label: 'Estudios disponibles',
									value: filtrosContados.get('ESTUDIO_DISPONIBLE') ?? 0,
									icon: FileText,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName='border-violet-500/35 bg-violet-500/[0.06]'
								iconClassName='text-violet-600 dark:text-violet-400'
							/>
							<CardKpi
								datos={{
									key: 'activos',
									label: 'Clientes activos',
									value: prospectos?.length ?? 0,
									icon: Users,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName='border-indigo-500/35 bg-indigo-500/[0.06]'
								iconClassName='text-indigo-600 dark:text-indigo-400'
							/>
						</div>
					</>
				)}

				{esEjecutivoEvaluacion && (
					<>
						<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4'>
							<CardKpi
								datos={{
									key: 'pendRevision',
									label: 'Pendientes de revisión',
									value:
										filtrosContados.get('COTIZACION_SOLICITADA_COMPANY') ?? 0,
									icon: Bell,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName='border-sky-500/35 bg-sky-500/[0.06]'
								iconClassName='text-sky-600 dark:text-sky-400'
							/>
							<CardKpi
								datos={{
									key: 'infoCompleta',
									label: 'Información completa',
									value: 0,
									icon: ClipboardList,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName='border-emerald-500/30 bg-emerald-500/[0.05]'
								iconClassName='text-emerald-600 dark:text-emerald-400'
							/>
							<CardKpi
								datos={{
									key: 'recotizaciones',
									label: 'Recotizaciones pendientes',
									value: filtrosContados.get('RECOTIZACION_SOLICITADA') ?? 0,
									icon: RefreshCw,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName='border-violet-500/35 bg-violet-500/[0.06]'
								iconClassName='text-violet-600 dark:text-violet-400'
							/>
							<CardKpi
								datos={{
									key: 'estXGenerar',
									label: 'Estudios por generar',
									value: filtrosContados.get('COTIZACION_DISPONIBLE') ?? 0,
									icon: Upload,
								}}
								setKpiAbierto={setKpiAbierto}
								accentClassName='border-indigo-500/35 bg-indigo-500/[0.06]'
								iconClassName='text-indigo-600 dark:text-indigo-400'
							/>
						</div>

						<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
							<Link
								href='/solicitudes-estudio'
								className='group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								<Card className='border-border bg-card shadow-none transition-colors group-hover:bg-muted/15'>
									<CardContent className='flex items-center gap-3 p-3.5 sm:p-4'>
										<span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60'>
											<ClipboardList
												className='h-5 w-5 text-muted-foreground'
												aria-hidden
											/>
										</span>
										<div className='min-w-0 flex-1'>
											<h2 className='text-sm font-semibold leading-snug text-foreground sm:text-base'>
												Solicitudes de estudio
											</h2>
											<p className='mt-0.5 text-xs leading-snug text-muted-foreground'>
												Revisa y gestiona las solicitudes de cotización
											</p>
										</div>
										<ArrowRight
											className='h-4 w-4 shrink-0 text-primary opacity-80 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5'
											aria-hidden
										/>
									</CardContent>
								</Card>
							</Link>
							<Link
								href='/cotizaciones-estudios-emitidos'
								className='group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								<Card className='border-border bg-card shadow-none transition-colors group-hover:bg-muted/15'>
									<CardContent className='flex items-center gap-3 p-3.5 sm:p-4'>
										<span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60'>
											<FileText
												className='h-5 w-5 text-muted-foreground'
												aria-hidden
											/>
										</span>
										<div className='min-w-0 flex-1'>
											<h2 className='text-sm font-semibold leading-snug text-foreground sm:text-base'>
												Cotizaciones / estudios emitidos
											</h2>
											<p className='mt-0.5 text-xs leading-snug text-muted-foreground'>
												Historial de cotizaciones y estudios emitidos
											</p>
										</div>
										<ArrowRight
											className='h-4 w-4 shrink-0 text-primary opacity-80 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5'
											aria-hidden
										/>
									</CardContent>
								</Card>
							</Link>
						</div>
					</>
				)}

				{esEjecutivoCobranza && (
					<PanelCobranzaClient dashboardInicial={dashboardCobranzaInicial} />
				)}

				{!esEjecutivoCobranza && <CardProspectosClient prospectos={prospectos} />}
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
