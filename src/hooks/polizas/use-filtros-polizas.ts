import type { FiltroEstadoPoliza } from '@/components/paneles/polizas/kpi-polizas'
import { useCallback, useMemo, useState } from 'react'
import type { FiltrosPanelPolizas } from './use-panel-polizas'

export const TODOS = '__todos__'

export type FiltrosPolizasState = {
	texto_busqueda: string
	id_company: string
	id_linea_negocio: string
	estado: FiltroEstadoPoliza
}

const FILTROS_POLIZAS_DEFAULT: FiltrosPolizasState = {
	texto_busqueda: '',
	id_company: TODOS,
	id_linea_negocio: TODOS,
	estado: 'vigentes',
}

type UseFiltrosPolizasParams = {
	filtrosIniciales?: Partial<FiltrosPolizasState>
	tamanoPagina?: number
	id_cliente?: number | null
}

export function useFiltrosPolizas(params?: UseFiltrosPolizasParams) {
	const tamanoPagina = params?.tamanoPagina ?? 20
	const id_cliente = params?.id_cliente ?? null

	const filtrosIniciales: FiltrosPolizasState = useMemo(
		() => ({
			...FILTROS_POLIZAS_DEFAULT,
			...params?.filtrosIniciales,
		}),
		[params?.filtrosIniciales],
	)

	const [filtros, setFiltros] = useState<FiltrosPolizasState>(filtrosIniciales)
	const [pagina, setPagina] = useState(1)

	const handleCambiarFiltro = useCallback(
		<K extends keyof FiltrosPolizasState>(
			key: K,
			value: FiltrosPolizasState[K],
		) => {
			setFiltros(prev => ({ ...prev, [key]: value }))
			setPagina(1)
		},
		[],
	)

	const handleCambiarEstado = useCallback(
		(estado: FiltroEstadoPoliza) =>
			handleCambiarFiltro(
				'estado',
				filtros.estado === estado ? 'vigentes' : estado,
			),
		[handleCambiarFiltro, filtros.estado],
	)

	const handleLimpiarFiltros = useCallback(() => {
		setFiltros(filtrosIniciales)
		setPagina(1)
	}, [filtrosIniciales])

	const hayFiltrosActivos = useMemo(
		() =>
			filtros.texto_busqueda !== '' ||
			filtros.id_company !== TODOS ||
			filtros.id_linea_negocio !== TODOS ||
			filtros.estado !== 'todas',
		[filtros],
	)

	const filtrosParaBackend: FiltrosPanelPolizas = useMemo(
		() => ({
			id_cliente,
			id_company:
				filtros.id_company !== TODOS ? Number(filtros.id_company) : undefined,
			id_linea_negocio:
				filtros.id_linea_negocio !== TODOS
					? Number(filtros.id_linea_negocio)
					: undefined,
			texto_busqueda: filtros.texto_busqueda || undefined,
			estado: filtros.estado,
			pagina,
			tamano_pagina: tamanoPagina,
		}),
		[filtros, pagina, tamanoPagina, id_cliente],
	)

	return {
		filtros,
		pagina,
		setPagina,
		handleCambiarFiltro,
		handleCambiarEstado,
		handleLimpiarFiltros,
		hayFiltrosActivos,
		filtrosParaBackend,
	}
}
