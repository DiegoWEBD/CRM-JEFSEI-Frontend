'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { PanelKpiCard } from '@/components/paneles/shared/panel-kpi-card'
import { useCompaniesSeguros } from '@/hooks/companies-seguros/use-companies-seguros'
import { useFiltrosPolizas } from '@/hooks/polizas/use-filtros-polizas'
import { usePanelPolizas } from '@/hooks/polizas/use-panel-polizas'
import {
	AlertTriangle,
	Ban,
	CheckCircle2,
	Clock,
	DollarSign,
	Shield,
} from 'lucide-react'
import ContenedorPolizas from './contenedor-polizas/contenedor-polizas'
import BarraFiltrosPolizas from './contenedor-polizas/filtros-polizas/barra-filtros-polizas'

type CardPolizasProps = {
	idCliente?: number
}

export default function CardPolizas({ idCliente }: CardPolizasProps) {
	const { data: companias } = useCompaniesSeguros({ enabled: true })

	const {
		filtros,
		handleCambiarFiltro,
		handleCambiarEstado,
		handleLimpiarFiltros,
		hayFiltrosActivos,
		filtrosParaBackend,
	} = useFiltrosPolizas({ id_cliente: idCliente, tamanoPagina: 50 })

	const { data, isFetching } = usePanelPolizas(filtrosParaBackend, {
		enabled: Boolean(idCliente),
	})

	const kpis = data?.kpis

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
							<PanelKpiCard
								label='Pólizas vigentes'
								value={(kpis?.vigentes ?? 0) + (kpis?.por_vencer ?? 0)}
								icon={CheckCircle2}
								activa={filtros.estado === 'vigentes'}
								onClick={() => handleCambiarEstado('vigentes')}
								accent='success'
							/>

							<PanelKpiCard
								label='Canceladas'
								value={kpis?.canceladas ?? 0}
								icon={Ban}
								activa={filtros.estado === 'canceladas'}
								onClick={() => handleCambiarEstado('canceladas')}
								accent='violet'
							/>

							<PanelKpiCard
								label='Prima vigente'
								value={`UF ${kpis?.prima_vigente ?? 0}`}
								icon={DollarSign}
								accent='primary'
							/>

							<PanelKpiCard
								label='Total pólizas'
								value={kpis?.total_polizas ?? 0}
								activa={filtros.estado === 'todas'}
								onClick={() => handleCambiarEstado('todas')}
								icon={Shield}
							/>

							<PanelKpiCard
								label='Por vencer'
								value={kpis?.por_vencer ?? 0}
								icon={Clock}
								activa={filtros.estado === 'por_vencer'}
								onClick={() => handleCambiarEstado('por_vencer')}
								accent='warning'
							/>

							<PanelKpiCard
								label='Vencidas'
								value={kpis?.vencidas ?? 0}
								icon={AlertTriangle}
								activa={filtros.estado === 'vencidas'}
								onClick={() => handleCambiarEstado('vencidas')}
								accent='danger'
							/>
						</div>

						<BarraFiltrosPolizas
							filtros={filtros}
							companias={companias ?? []}
							hayFiltrosActivos={hayFiltrosActivos}
							onCambiar={handleCambiarFiltro}
							onLimpiar={handleLimpiarFiltros}
						/>

						<ContenedorPolizas polizas={data?.polizas} isLoading={isFetching} />
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	)
}
