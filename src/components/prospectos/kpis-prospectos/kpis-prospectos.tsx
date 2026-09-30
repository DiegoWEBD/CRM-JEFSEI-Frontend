'use client'

import {
	Bell,
	ClipboardList,
	FileText,
	RefreshCw,
	Upload,
	UserCheck,
	Users,
} from 'lucide-react'
import { useMemo } from 'react'

import AuthGuard from '@/components/layouts/guards/auth-guard'
import { PanelKpiCard } from '@/components/paneles/shared/panel-kpi-card'
import PanelKpiContainer from '@/components/paneles/shared/panel-kpi-container/panel-kpi-container'
import { useFiltrosProspectos } from '@/hooks/prospectos/use-filtros-prospectos'

type KpisProspectosProps = {
	contadoresEstado?: Record<string, number>
	filtro: string
	onFiltroChange: (valor: string) => void
}

export default function KpisProspectos({
	contadoresEstado,
	filtro,
	onFiltroChange,
}: KpisProspectosProps) {
	const { contadores } = useFiltrosProspectos(contadoresEstado)

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
		const destino = KPI_FILTRO[key]
		if (!destino) return
		onFiltroChange(filtro === destino ? 'todos' : destino)
	}

	const totalProspectos = contadores.get('prospecto') ?? 0
	const clientesActivos = contadores.get('cliente_activo') ?? 0
	const clientesInactivos = contadores.get('cliente_inactivo') ?? 0

	return (
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
					activa={filtro === 'prospecto'}
					accent='warning'
				/>

				<PanelKpiCard
					key='activos'
					label='Clientes activos'
					value={clientesActivos}
					icon={Users}
					onClick={() => onKpiClick('activos')}
					activa={filtro === 'cliente_activo'}
					accent='success'
				/>

				<PanelKpiCard
					key='inactivos'
					label='Clientes inactivos'
					value={clientesInactivos}
					icon={Users}
					onClick={() => onKpiClick('inactivos')}
					activa={filtro === 'cliente_inactivo'}
					accent='danger'
				/>

				<AuthGuard fallback={null} allowedRoles={['EJECUTIVO_COMERCIAL']}>
					<PanelKpiCard
						key='cotiz'
						label='Cotizaciones solicitadas'
						value={contadores.get('COTIZACION_SOLICITADA_COMPANY') ?? 0}
						icon={ClipboardList}
						onClick={() => onKpiClick('cotiz')}
						activa={filtro === 'COTIZACION_SOLICITADA_COMPANY'}
					/>
					<PanelKpiCard
						key='estDisp'
						label='Estudios disponibles'
						value={contadores.get('ESTUDIO_DISPONIBLE') ?? 0}
						icon={FileText}
						onClick={() => onKpiClick('estDisp')}
						activa={filtro === 'ESTUDIO_DISPONIBLE'}
					/>
				</AuthGuard>
			</AuthGuard>

			<AuthGuard fallback={null} allowedRoles={['EJECUTIVO_EVALUACION_PROYECTOS']}>
				<PanelKpiCard
					key='pendRevision'
					label='Cotizaciones pendientes'
					value={contadores.get('COTIZACION_SOLICITADA_COMPANY') ?? 0}
					icon={Bell}
					onClick={() => onKpiClick('pendRevision')}
					activa={filtro === 'COTIZACION_SOLICITADA_COMPANY'}
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
					value={contadores.get('RECOTIZACION_SOLICITADA') ?? 0}
					icon={RefreshCw}
					onClick={() => onKpiClick('recotizaciones')}
					activa={filtro === 'RECOTIZACION_SOLICITADA'}
					accent='primary'
				/>
				<PanelKpiCard
					key='estXGenerar'
					label='Estudios por generar'
					value={contadores.get('COTIZACION_DISPONIBLE') ?? 0}
					icon={Upload}
					onClick={() => onKpiClick('estXGenerar')}
					activa={filtro === 'COTIZACION_DISPONIBLE'}
					accent='info'
				/>
			</AuthGuard>
		</PanelKpiContainer>
	)
}
