'use client'

import { ClipboardList, FileText, UserCheck, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import CardCalendario from '@/components/card-calendario/card-calendario'
import CardComunicadoGerencia from '@/components/card-comunicado-gerencia/card-comunicado-gerencia'
import { DatosKpi } from '@/hooks/kpi/dto/datos-kpi'
import { FiltroEstadoValor, useFiltrarProspectos } from '@/hooks/prospectos/use-filtrar-prospectos'
import { useFiltrosProspectos } from '@/hooks/prospectos/use-filtros-prospectos'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import CardProspectosClient from '../../prospectos/card-prospectos/card-prospectos-client'
import PanelFooter from '../panel-layout/panel-footer/panel-footer'
import PanelHeader from '../panel-layout/panel-header/panel-header'
import PanelLayout from '../panel-layout/panel-layout'
import CardKpi from './cards/card-kpi/card-kpi'
import MetricasEjecutivoComercial from './metricas-ejecutivo-comercial/metricas-ejecutivo-comercial'
import SheetClientesFiltrados from './sheet-clientes-filtrados'

type EjecutivoComercialPanelClientProps = {
	prospectosIniciales: ProspectoResumenJson[]
}

export default function EjecutivoComercialPanelClient({
	prospectosIniciales,
}: EjecutivoComercialPanelClientProps) {
	const { data: prospectos } = useObtenerProspectos(prospectosIniciales)

	const [kpiAbierto, setKpiAbierto] = useState<string | null>(null)

	const { filtrosContados } = useFiltrosProspectos(prospectos)

	const tarjetasResumen: DatosKpi[] = useMemo(() => [
		{
			key: 'asignados',
			label: 'Clientes asignados',
			value: prospectos?.length ?? 0,
			icon: UserCheck,
		},
		{
			key: 'cotiz',
			label: 'Cotizaciones solicitadas',
			value: filtrosContados.get('COTIZACION_SOLICITADA_COMPANY') ?? 0,
			icon: ClipboardList,
		},
		{
			key: 'estDisp',
			label: 'Estudios disponibles',
			value: filtrosContados.get('ESTUDIO_DISPONIBLE') ?? 0,
			icon: FileText,
		},
		{
			key: 'activos',
			label: 'Clientes activos',
			value: prospectos?.length ?? 0,
			icon: Users,
		},
	], [filtrosContados, prospectos])

	const { filtrar } = useFiltrarProspectos(prospectos)

	const KPI_FILTRO: Record<string, FiltroEstadoValor> = {
		asignados: 'todos',
		activos: 'todos',
		cotiz: 'COTIZACION_SOLICITADA_COMPANY',
		estDisp: 'ESTUDIO_DISPONIBLE',
	}

	const KPI_TITULOS: Record<string, string> = {
		asignados: 'Clientes asignados',
		activos: 'Clientes activos',
		cotiz: 'Cotizaciones solicitadas',
		estDisp: 'Estudios disponibles',
	}

	const prospectosSheet = useMemo(
		() => filtrar(KPI_FILTRO[kpiAbierto ?? '']),
		[kpiAbierto, filtrar],
	)

	const tituloSheet = kpiAbierto ? KPI_TITULOS[kpiAbierto] ?? '' : ''

	return (
		<PanelLayout>
			<PanelHeader>
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
				<CardProspectosClient prospectos={prospectos} />
			</PanelHeader>

			<CardCalendario prospectos={prospectos} />

			<PanelFooter>
				<CardComunicadoGerencia />
			</PanelFooter>

			<SheetClientesFiltrados
				prospectos={prospectosSheet}
				titulo={tituloSheet}
				abierto={kpiAbierto != null}
				onOpenChange={open => { if (!open) setKpiAbierto(null) }}
			/>
		</PanelLayout>
	)
}
