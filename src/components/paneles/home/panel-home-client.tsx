'use client'

import { useMemo, useState } from 'react'

import { ObtenerProspectosResponse } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/obtener-prospectos-response'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import PanelCobranzaClient from '@/components/paneles/ejecutivo-cobranza/panel-cobranza-client'
import AlertasEjecutivo from '@/components/paneles/home/alertas-ejecutivo/alertas-ejecutivo'
import HomeAvisosGerencia from '@/components/paneles/home/home-avisos-gerencia/home-avisos-gerencia'
import HomeCalendarioMes from '@/components/paneles/home/home-calendario-mes/home-calendario-mes'
import HomeKpiStrip from '@/components/paneles/home/home-kpi-strip/home-kpi-strip'
import HomePageHeader from '@/components/paneles/home/home-page-header/home-page-header'
import HomeRecordatoriosHoy from '@/components/paneles/home/home-recordatorios-hoy/home-recordatorios-hoy'
import HomeSolicitudesRecientes from '@/components/paneles/home/home-solicitudes-recientes/home-solicitudes-recientes'
import PanelBody from '@/components/paneles/panel-layout/panel-body/panel-body'
import PanelBodyMainContent from '@/components/paneles/panel-layout/panel-body/panel-body-main-content/panel-body-main-content'
import PanelBodySidebar from '@/components/paneles/panel-layout/panel-body/panel-body-sidebar/panel-body-sidebar'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { DashboardCobranza } from '@/dominio/cobranza/dashboard-cobranza'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import { formatearFecha } from '@/utils/formatear-fecha'

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

	const hoyIso = useMemo(() => formatearFecha(new Date(), 'yyyy-MM-dd'), [])
	const [diaSeleccionado, setDiaSeleccionado] = useState(hoyIso)

	return (
		<PanelLayout>
			<HomePageHeader
				nombreUsuario={nombreUsuario}
				prospectos={prospectos}
			/>

			<HomeKpiStrip />

			<PanelBody>
				<PanelBodyMainContent>
					<PermissionGuard allowedPermissions={['VER_ALERTAS']}>
						<AlertasEjecutivo />
					</PermissionGuard>

					<HomeAvisosGerencia />

					{esEjecutivoCobranza && (
						<PanelCobranzaClient dashboardInicial={dashboardCobranzaInicial} />
					)}

					<AuthGuard
						fallback={null}
						allowedRoles={['EJECUTIVO_EVALUACION_PROYECTOS']}
					>
						<HomeSolicitudesRecientes />
					</AuthGuard>
				</PanelBodyMainContent>

				<PanelBodySidebar>
					<HomeRecordatoriosHoy fecha={diaSeleccionado} prospectos={prospectos} />
					<HomeCalendarioMes
						diaSeleccionado={diaSeleccionado}
						onDiaSeleccionadoChange={setDiaSeleccionado}
					/>
				</PanelBodySidebar>
			</PanelBody>
		</PanelLayout>
	)
}
