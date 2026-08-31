'use client'

import type { KpisPoliza } from '@/aplicacion/polizas/use_cases/dto/obtener_polizas_response'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import {
	PanelKpiCard,
	PanelKpiSkeleton,
} from '@/components/paneles/shared/panel-kpi-card/panel-kpi-card'
import { formatUF } from '@/lib/uf'
import { DollarSign, FileText, Percent, TrendingUp } from 'lucide-react'
import PanelKpiContainer from '../shared/panel-kpi-container/panel-kpi-container'

export type FiltroEstadoPoliza =
	| 'todas'
	| 'vigentes'
	| 'por_vencer'
	| 'vencidas'
	| 'canceladas'
	| 'registradas'

type KpiPolizasProps = {
	kpis?: KpisPoliza
	filtroEstado: FiltroEstadoPoliza
	onFiltroEstadoChange: (filtro: FiltroEstadoPoliza) => void
}

export function KpiPolizas({
	kpis,
	filtroEstado,
	onFiltroEstadoChange,
}: KpiPolizasProps) {
	if (!kpis) {
		return <PanelKpiSkeleton count={5} />
	}

	return (
		<div className='space-y-3'>
			<PanelKpiContainer className=' lg:grid'>
				<PanelKpiCard
					label='Total pólizas'
					value={kpis.total_polizas}
					icon={FileText}
					onClick={() => onFiltroEstadoChange('todas')}
					activa={filtroEstado === 'todas'}
					accent='primary'
				/>

				<PanelKpiCard
					label='Vigentes'
					value={kpis.vigentes}
					icon={FileText}
					onClick={() => onFiltroEstadoChange('vigentes')}
					activa={filtroEstado === 'vigentes'}
					accent='success'
				/>

				<PanelKpiCard
					label='Por vencer'
					value={kpis.por_vencer}
					icon={FileText}
					onClick={() => onFiltroEstadoChange('por_vencer')}
					activa={filtroEstado === 'por_vencer'}
					accent='warning'
				/>

				<PanelKpiCard
					label='Vencidas'
					value={kpis.vencidas}
					icon={FileText}
					onClick={() => onFiltroEstadoChange('vencidas')}
					activa={filtroEstado === 'vencidas'}
					accent='danger'
				/>

				<PanelKpiCard
					label='Canceladas'
					value={kpis.canceladas}
					icon={FileText}
					onClick={() => onFiltroEstadoChange('canceladas')}
					activa={filtroEstado === 'canceladas'}
				/>

				<PanelKpiCard
					label='Registradas'
					value={kpis.registradas}
					icon={FileText}
					onClick={() => onFiltroEstadoChange('registradas')}
					activa={filtroEstado === 'registradas'}
				/>
			</PanelKpiContainer>

			<PanelKpiContainer>
				<PanelKpiCard
					label='Prima neta total'
					value={formatUF(kpis.prima_neta_total)}
					icon={DollarSign}
					accent='primary'
				/>

				<PanelKpiCard
					label='Prima neta vigente'
					value={formatUF(kpis.prima_vigente)}
					icon={TrendingUp}
					accent='success'
				/>
				<AuthGuard
					allowedRoles={[
						'GERENTE_GENERAL',
						'GERENTE_COMERCIAL',
						'GERENTE_OPERACIONES',
					]}
				>
					<PanelKpiCard
						label='Comisión total'
						value={formatUF(kpis.comision_total)}
						icon={Percent}
						accent='primary'
					/>
				</AuthGuard>
			</PanelKpiContainer>
		</div>
	)
}
