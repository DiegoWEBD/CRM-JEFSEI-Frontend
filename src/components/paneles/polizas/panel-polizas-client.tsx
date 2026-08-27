'use client'

import { useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { usePanelPolizas } from '@/hooks/polizas/use-panel-polizas'
import { KpiPolizas, type FiltroEstadoPoliza } from './kpi-polizas'
import FiltrosPolizas, { TODOS, type FiltrosPanelPolizas } from './filtros-polizas'
import TablaPolizas from './tabla-polizas'
import type { PanelPolizasResponse } from '@/aplicacion/polizas/use_cases/dto/obtener_polizas_response'

const TAMANO_PAGINA = 20

const ESTADO_A_BACKEND: Record<string, string> = {
	vigentes: 'VIGENTE',
	por_vencer: 'POR_VENCER',
	vencidas: 'VENCIDA',
	canceladas: 'CANCELADA',
	registradas: 'REGISTRADA',
}

type PanelPolizasClientProps = {
	initialData?: PanelPolizasResponse
}

export default function PanelPolizasClient({ initialData }: PanelPolizasClientProps) {
	const [filtros, setFiltros] = useState<FiltrosPanelPolizas>({
		texto_busqueda: '',
		id_company: TODOS,
		id_linea_negocio: TODOS,
	})
	const [pagina, setPagina] = useState(1)
	const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoPoliza>('todas')

	const textoBusquedaDebounced = useDebounce(filtros.texto_busqueda, 300)

	const estadoBackend = filtroEstado !== 'todas' ? ESTADO_A_BACKEND[filtroEstado] : undefined

	const { data, isFetching } = usePanelPolizas({
		id_company: filtros.id_company !== TODOS ? Number(filtros.id_company) : undefined,
		id_linea_negocio: filtros.id_linea_negocio !== TODOS ? Number(filtros.id_linea_negocio) : undefined,
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

	const datos = data ?? initialData

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-xl font-semibold tracking-tight'>Pólizas</h1>
				<p className='text-sm text-muted-foreground'>
					Gestión y seguimiento de pólizas registradas
				</p>
			</div>

			<KpiPolizas
				kpis={datos?.kpis}
				loading={isFetching && !datos}
				filtroEstado={filtroEstado}
				onFiltroEstadoChange={handleFiltroEstadoChange}
			/>

			<FiltrosPolizas
				filtros={filtros}
				onChange={handleFiltrosChange}
				total={datos?.total}
			/>

			<TablaPolizas
				polizas={datos?.polizas ?? []}
				isFetching={isFetching}
				pagina={pagina}
				totalPaginas={datos?.total_paginas ?? 1}
				onPaginaChange={setPagina}
			/>
		</div>
	)
}
