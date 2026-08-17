'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import Poliza from '@/dominio/poliza/poliza'
import { useQueryPolizas } from '@/hooks/polizas/use-query-polizas'
import { KPI_PASTEL } from '@/lib/kpi-pastel'
import { useMemo, useState } from 'react'
import ContenedorPolizas from './contenedor-polizas/contenedor-polizas'
import BarraFiltrosPolizas, {
	type FiltrosPolizasCliente,
	FILTROS_POLIZAS_INICIAL,
} from './contenedor-polizas/filtros-polizas/barra-filtros-polizas'
import KpiEstadoPoliza from './kpi-estado-poliza/kpi-estado-poliza'

function diasHasta(ymd: string | undefined): number | null {
	if (!ymd) return null
	const hoy = new Date()
	hoy.setHours(0, 0, 0, 0)
	const fin = new Date(`${ymd}T12:00:00`)
	const diff = fin.getTime() - hoy.getTime()
	return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function filtrarPolizas(
	polizas: Poliza[],
	filtros: FiltrosPolizasCliente,
): Poliza[] {
	return polizas.filter(p => {
		if (filtros.estado !== 'todas' && p.estado !== filtros.estado) return false

		if (
			filtros.compania !== 'todas' &&
			(p.company?.nombre ?? '—') !== filtros.compania
		)
			return false

		if (filtros.rangoVencimiento !== 'todas') {
			const dias = diasHasta(p.fin_vigencia)
			if (filtros.rangoVencimiento === 'vencidas') {
				if (dias === null || dias > 0) return false
			} else {
				const limite = Number(filtros.rangoVencimiento)
				if (dias === null || dias < 0 || dias > limite) return false
			}
		}

		if (filtros.busqueda) {
			const q = filtros.busqueda.toLowerCase()
			const numero = p.numero_poliza.toLowerCase()
			const compania = (p.company?.nombre ?? '').toLowerCase()
			const producto = p.nombre_producto.toLowerCase()
			if (!numero.includes(q) && !compania.includes(q) && !producto.includes(q))
				return false
		}

		return true
	})
}

function esFiltroActivo(f: FiltrosPolizasCliente): boolean {
	return (
		f.estado !== 'todas' ||
		f.compania !== 'todas' ||
		f.rangoVencimiento !== 'todas' ||
		f.busqueda !== ''
	)
}

type CardPolizasProps = {
	idCliente?: number
	nombreCliente: string
}

export default function CardPolizas({
	idCliente,
	nombreCliente,
}: CardPolizasProps) {
	const { data: polizas } = useQueryPolizas(idCliente)
	const [filtros, setFiltros] = useState<FiltrosPolizasCliente>(
		FILTROS_POLIZAS_INICIAL,
	)

	const polizasFiltradas = useMemo(
		() => filtrarPolizas(polizas ?? [], filtros),
		[polizas, filtros],
	)

	const companias = useMemo(() => {
		if (!polizas) return []
		const set = new Set<string>()
		polizas.forEach(p => {
			if (p.company?.nombre) set.add(p.company.nombre)
		})
		return Array.from(set).sort()
	}, [polizas])

	const hayFiltrosActivos = esFiltroActivo(filtros)

	const polizasPorEstado = useMemo(() => {
		const map = new Map<string, number>()
		if (!polizas) return map
		for (const p of polizas) {
			map.set(p.estado, (map.get(p.estado) ?? 0) + 1)
		}
		return map
	}, [polizas])

	const primaVigente = useMemo(() => {
		if (!polizas) return 0
		return polizas.reduce(
			(sum, p) =>
				p.estado !== 'VENCIDA' && p.estado !== 'CANCELADA'
					? sum + p.prima_neta
					: sum,
			0,
		)
	}, [polizas])

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle className='min-w-0 text-sm font-semibold leading-tight tracking-tight text-foreground'>
					Pólizas del cliente
				</CardTitle>
			</CardHeader>

			<CardContent>
				<Card className='border-border shadow-none'>
					<CardContent className='space-y-2.5 p-3'>
						<div className='grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3'>
							<KpiEstadoPoliza
								label='Pólizas vigentes'
								kpi={
									(polizasPorEstado.get('VIGENTE') ?? 0) +
									(polizasPorEstado.get('POR_VENCER') ?? 0)
								}
								className={KPI_PASTEL.success.card}
							/>
							<KpiEstadoPoliza
								label='Canceladas'
								kpi={polizasPorEstado.get('CANCELADA') ?? 0}
							/>

							<KpiEstadoPoliza
								label='Prima vigente'
								kpi={`UF ${primaVigente}`}
								className={KPI_PASTEL.info.card}
							/>

							<KpiEstadoPoliza
								label='Total pólizas'
								kpi={polizas?.length || 0}
							/>

							<KpiEstadoPoliza
								label='Por vencer'
								kpi={polizasPorEstado.get('POR_VENCER') ?? 0}
								className={KPI_PASTEL.warning.card}
							/>

							<KpiEstadoPoliza
								label='Vencidas'
								kpi={polizasPorEstado.get('VENCIDA') ?? 0}
							/>
						</div>

						<BarraFiltrosPolizas
							filtros={filtros}
							companias={companias}
							hayFiltrosActivos={hayFiltrosActivos}
							onCambiar={(key, value) =>
								setFiltros(prev => ({ ...prev, [key]: value }))
							}
							onLimpiar={() => setFiltros(FILTROS_POLIZAS_INICIAL)}
						/>

						<ContenedorPolizas polizas={polizasFiltradas} />
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	)
}
