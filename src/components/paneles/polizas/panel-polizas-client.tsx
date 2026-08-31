'use client'

import { usePanelPolizas } from '@/hooks/polizas/use-panel-polizas'
import { useDebounce } from '@/hooks/use-debounce'
import { useState } from 'react'
import FiltrosPolizas, {
	TODOS,
	type FiltrosPanelPolizas,
} from './filtros-polizas'
import { KpiPolizas, type FiltroEstadoPoliza } from './kpi-polizas'
import TablaPolizas from './tabla-polizas'

const TAMANO_PAGINA = 10

const ESTADO_A_BACKEND: Record<string, string> = {
	vigentes: 'VIGENTE',
	por_vencer: 'POR_VENCER',
	vencidas: 'VENCIDA',
	canceladas: 'CANCELADA',
	registradas: 'REGISTRADA',
}

export default function PanelPolizasClient() {
	const [filtros, setFiltros] = useState<FiltrosPanelPolizas>({
		texto_busqueda: '',
		id_company: TODOS,
		id_linea_negocio: TODOS,
	})
	const [pagina, setPagina] = useState(1)
	const [filtroEstado, setFiltroEstado] =
		useState<FiltroEstadoPoliza>('vigentes')

	const textoBusquedaDebounced = useDebounce(filtros.texto_busqueda, 300)

	const estadoBackend =
		filtroEstado !== 'todas' ? ESTADO_A_BACKEND[filtroEstado] : undefined

	const { data, isFetching } = usePanelPolizas({
		id_company:
			filtros.id_company !== TODOS ? Number(filtros.id_company) : undefined,
		id_linea_negocio:
			filtros.id_linea_negocio !== TODOS
				? Number(filtros.id_linea_negocio)
				: undefined,
		texto_busqueda: textoBusquedaDebounced || undefined,
		estado: estadoBackend,
		pagina,
		tamano_pagina: TAMANO_PAGINA,
	})

	const handleFiltrosChange = (nuevosFiltros: FiltrosPanelPolizas) => {
		setFiltros(nuevosFiltros)
		setPagina(1)
	}

	const handleFiltroEstadoChange = (estado: FiltroEstadoPoliza) => {
		setFiltroEstado(estado)
		setPagina(1)
	}

	return (
		<div className='space-y-6'>
			<nav className='flex items-center gap-1.5 text-xs text-muted-foreground'>
				<span className='hover:text-foreground cursor-default transition-colors'>
					Comercial
				</span>
				<span className='text-border'>/</span>
				<span className='font-medium text-foreground'>Pólizas</span>
			</nav>

			<KpiPolizas
				kpis={data?.kpis}
				filtroEstado={filtroEstado}
				onFiltroEstadoChange={handleFiltroEstadoChange}
			/>

			<FiltrosPolizas
				filtros={filtros}
				onChange={handleFiltrosChange}
				total={data?.total}
			/>

			<TablaPolizas
				polizas={data?.polizas || []}
				isFetching={isFetching}
				pagina={pagina}
				totalPaginas={data?.total_paginas || 0}
				onPaginaChange={setPagina}
			/>
		</div>
	)
}
