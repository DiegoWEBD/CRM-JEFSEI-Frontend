'use client'

import { ClipboardList, FileText, UserCheck, Users } from 'lucide-react'
import { useState } from 'react'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import CardCalendario from '@/components/card-calendario/card-calendario'
import CardComunicadoGerencia from '@/components/card-comunicado-gerencia/card-comunicado-gerencia'
import { DatosKpi } from '@/hooks/kpi/dto/datos-kpi'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import CardProspectosClient from '../../prospectos/card-prospectos/card-prospectos-client'
import PanelFooter from '../panel-layout/panel-footer/panel-footer'
import PanelHeader from '../panel-layout/panel-header/panel-header'
import PanelLayout from '../panel-layout/panel-layout'
import CardKpi from '../ejecutivo-comercial/cards/card-kpi/card-kpi'
import MetricasEjecutivoComercial from '../ejecutivo-comercial/metricas-ejecutivo-comercial/metricas-ejecutivo-comercial'

type PanelHomeClientProps = {
	prospectosIniciales: ProspectoResumenJson[]
	codigoRoles: string[]
}

export default function PanelHomeClient({
	prospectosIniciales,
	codigoRoles,
}: PanelHomeClientProps) {
	const { data: prospectos } = useObtenerProspectos(prospectosIniciales)

	const [kpiAbierto, setKpiAbierto] = useState<string | null>(null)

	const esEjecutivoComercial = codigoRoles.includes('EJECUTIVO_COMERCIAL')
	const esEjecutivoEvaluacion = codigoRoles.includes(
		'EJECUTIVO_EVALUACION_PROYECTOS',
	)

	const tarjetasResumen: DatosKpi[] = [
		{
			key: 'asignados',
			label: 'Clientes asignados',
			value: 7,
			icon: UserCheck,
			infoAdicional: 2,
		},
		{
			key: 'cotiz',
			label: 'Cotizaciones solicitadas',
			value: 3,
			icon: ClipboardList,
		},
		{
			key: 'estDisp',
			label: 'Estudios disponibles',
			value: 2,
			icon: FileText,
		},
		{
			key: 'activos',
			label: 'Clientes activos',
			value: 1,
			icon: Users,
		},
	]

	return (
		<PanelLayout>
			<PanelHeader>
				{esEjecutivoComercial && (
					<>
						<MetricasEjecutivoComercial />
						<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4'>
							{tarjetasResumen.map(datos => (
								<CardKpi
									key={datos.key}
									datos={datos}
									setKpiAbierto={setKpiAbierto}
								/>
							))}
						</div>
					</>
				)}

				{esEjecutivoEvaluacion && (
					<>
						{/* Header específico para ejecutivo de evaluación — se implementará más adelante */}
					</>
				)}

				<CardProspectosClient prospectos={prospectos} />
			</PanelHeader>

			<CardCalendario prospectos={prospectos} />

			<PanelFooter>
				<CardComunicadoGerencia />
			</PanelFooter>
		</PanelLayout>
	)
}
