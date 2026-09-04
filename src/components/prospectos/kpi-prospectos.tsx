'use client'

import { useMemo } from 'react'
import { Users, UserCheck } from 'lucide-react'
import PanelKpiContainer from '@/components/paneles/shared/panel-kpi-container/panel-kpi-container'
import { PanelKpiCard } from '@/components/paneles/shared/panel-kpi-card'

type KpiProspectosProps = {
	contadoresEstado?: Record<string, number>
}

export default function KpiProspectos({
	contadoresEstado,
}: KpiProspectosProps) {
	const contadores = useMemo(
		() => new Map(Object.entries(contadoresEstado ?? {})),
		[contadoresEstado],
	)

	return (
		<PanelKpiContainer>
			<PanelKpiCard
				label='Prospectos'
				value={contadores.get('prospecto') ?? 0}
				icon={UserCheck}
				accent='warning'
			/>
			<PanelKpiCard
				label='Clientes activos'
				value={contadores.get('cliente_activo') ?? 0}
				icon={Users}
				accent='success'
			/>
			<PanelKpiCard
				label='Clientes inactivos'
				value={contadores.get('cliente_inactivo') ?? 0}
				icon={Users}
				accent='danger'
			/>
		</PanelKpiContainer>
	)
}
