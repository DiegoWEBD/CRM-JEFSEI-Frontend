'use client'

import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import CardProspectosClient from '@/components/prospectos/card-prospectos/card-prospectos-client'
import { CardProspectosSkeleton } from '@/components/prospectos/card-prospectos/card-prospectos-skeleton'
import KpiProspectos from '@/components/prospectos/kpi-prospectos'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import { useDebounce } from '@/hooks/use-debounce'
import { Suspense, useState } from 'react'
import { ProspectosFiltros } from '../dto/prospectos-filtros'
import { PanelKpiCard } from '@/components/paneles/shared/panel-kpi-card'
import PanelKpiContainer from '@/components/paneles/shared/panel-kpi-container/panel-kpi-container'
import { UserCheck, Users } from 'lucide-react'

const ProspectosPageClient = () => {
	const [filtros, setFiltros] = useState<ProspectosFiltros>({
		filtroInterno: 'OPORTUNIDAD_CREADA',
		pagina: 1,
		inputValue: '',
		rutUsuario: '',
		region: '',
		comuna: '',
	})

	const textoBusqueda = useDebounce(filtros.inputValue, 300)

	const filtro = filtros.filtroInterno

	const { data, isFetching } = useObtenerProspectos(
		filtro === 'todos' ? null : filtro,
		textoBusqueda,
		filtros.pagina,
		10,
		filtros.rutUsuario || null,
		filtros.region || null,
		filtros.comuna || null,
	)

	return (
		<PanelLayout>
			<PanelHeader>
				<PanelKpiContainer>
					<PanelKpiCard
						label='Prospectos'
						value={data?.contadores_estado?.prospecto ?? 0}
						icon={UserCheck}
						accent='warning'
						activa={filtros.filtroInterno === 'prospecto'}
						onClick={() =>
							setFiltros({
								...filtros,
								filtroInterno:
									filtros.filtroInterno === 'prospecto' ? 'todos' : 'prospecto',
							})
						}
					/>
					<PanelKpiCard
						label='Clientes activos'
						value={data?.contadores_estado?.cliente_activo ?? 0}
						icon={Users}
						accent='success'
						activa={filtros.filtroInterno === 'cliente_activo'}
						onClick={() =>
							setFiltros({
								...filtros,
								filtroInterno:
									filtros.filtroInterno === 'cliente_activo'
										? 'todos'
										: 'cliente_activo',
							})
						}
					/>
					<PanelKpiCard
						label='Clientes inactivos'
						value={data?.contadores_estado?.cliente_inactivo ?? 0}
						icon={Users}
						accent='danger'
						activa={filtros.filtroInterno === 'cliente_inactivo'}
						onClick={() =>
							setFiltros({
								...filtros,
								filtroInterno:
									filtros.filtroInterno === 'cliente_inactivo'
										? 'todos'
										: 'cliente_inactivo',
							})
						}
					/>
				</PanelKpiContainer>
			</PanelHeader>
			<Suspense fallback={<CardProspectosSkeleton />}>
				<CardProspectosClient filtros={filtros} setFiltros={setFiltros} />
			</Suspense>
		</PanelLayout>
	)
}

export default ProspectosPageClient
