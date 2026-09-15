'use client'

import { useFiltrosPolizas } from '@/hooks/polizas/use-filtros-polizas'
import { usePanelPolizas } from '@/hooks/polizas/use-panel-polizas'
import { useDebounce } from '@/hooks/use-debounce'
import FiltrosPolizas from './filtros-polizas'
import { KpiPolizas } from './kpi-polizas'
import TablaPolizas from './tabla-polizas'

const TAMANO_PAGINA = 10

export default function PanelPolizasClient() {
	const {
		filtros,
		pagina,
		setPagina,
		handleCambiarFiltro,
		handleCambiarEstado,
		handleLimpiarFiltros,
		hayFiltrosActivos,
		filtrosParaBackend,
	} = useFiltrosPolizas({
		tamanoPagina: TAMANO_PAGINA,
		filtrosIniciales: { estado: 'vigentes' },
	})

	const textoBusquedaDebounced = useDebounce(filtros.texto_busqueda, 300)

	const filtrosConDebounce = {
		...filtrosParaBackend,
		texto_busqueda: textoBusquedaDebounced || undefined,
	}

	const { data, isFetching } = usePanelPolizas(filtrosConDebounce)

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
				filtroEstado={filtros.estado}
				onFiltroEstadoChange={handleCambiarEstado}
			/>

			<FiltrosPolizas
				filtros={filtros}
				onActualizar={handleCambiarFiltro}
				onLimpiar={handleLimpiarFiltros}
				hayFiltrosActivos={hayFiltrosActivos}
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
