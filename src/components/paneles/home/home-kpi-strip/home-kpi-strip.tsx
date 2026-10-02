'use client'

import { Bell, CalendarClock, Coins, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'

import { PanelKpiCard } from '@/components/paneles/shared/panel-kpi-card'
import PanelKpiContainer from '@/components/paneles/shared/panel-kpi-container/panel-kpi-container'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { useMetricasEjecutivoComercial } from '@/hooks/metricas/use-metricas-ejecutivo-comercial'
import { useContadorNoLeidas } from '@/hooks/notificaciones/use-contador-no-leidas'
import { useRecordatorios } from '@/hooks/recordatorios/use-recordatorios'
import { formatearFecha } from '@/utils/formatear-fecha'
import { normalizarNumeroFormatoChileno } from '@/utils/normalizar-numero-formato-chileno'

export default function HomeKpiStrip() {
	return (
		<PanelKpiContainer className='xl:grid-cols-4'>
			<PermissionGuard allowedPermissions={['VER_METRICAS_EJECUTIVO']}>
				<KpiPrimaVendida />
				<KpiComision />
			</PermissionGuard>
			<PermissionGuard allowedPermissions={['VER_ALERTAS']}>
				<KpiAlertas />
			</PermissionGuard>
			<KpiRecordatoriosHoy />
		</PanelKpiContainer>
	)
}

function KpiPrimaVendida() {
	const { data, isLoading } = useMetricasEjecutivoComercial()
	return (
		<PanelKpiCard
			label='Prima vendida'
			value={
				isLoading
					? '—'
					: `UF ${normalizarNumeroFormatoChileno(data?.prima_vendida ?? 0)}`
			}
			subtitle={
				data?.meta_mensual
					? `vs meta UF ${normalizarNumeroFormatoChileno(data.meta_mensual)}`
					: undefined
			}
			icon={TrendingUp}
			accent='primary'
		/>
	)
}

function KpiComision() {
	const { data, isLoading } = useMetricasEjecutivoComercial()
	return (
		<PanelKpiCard
			label='Comisión del mes'
			value={
				isLoading
					? '—'
					: `UF ${normalizarNumeroFormatoChileno(data?.comision ?? 0)}`
			}
			icon={Coins}
			accent='success'
		/>
	)
}

function KpiAlertas() {
	const { data, isLoading } = useContadorNoLeidas()
	const total = data?.contador ?? 0

	return (
		<PanelKpiCard
			label='Alertas sin leer'
			value={isLoading ? '—' : total}
			icon={Bell}
			accent={total > 0 ? 'danger' : 'info'}
		/>
	)
}

function KpiRecordatoriosHoy() {
	const hoyIso = useMemo(() => formatearFecha(new Date(), 'yyyy-MM-dd'), [])
	const { data, isLoading } = useRecordatorios({
		fecha: hoyIso,
		tamano_pagina: 1,
	})
	const total = data?.total ?? 0

	return (
		<PanelKpiCard
			label='Recordatorios hoy'
			value={isLoading ? '—' : total}
			icon={CalendarClock}
			accent='info'
		/>
	)
}
