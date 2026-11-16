'use client'

import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react'
import type { FiltrosDashboard } from '@/lib/filtros-dashboard'

type FiltrosDashboardContextValue = FiltrosDashboard & {
	setMes: (mes: number) => void
	setYear: (year: number) => void
}

const FiltrosDashboardContext =
	createContext<FiltrosDashboardContextValue | null>(null)

/**
 * Estado mes/año del dashboard de gerencia.
 *
 * Es un provider cliente que envuelve a las tarjetas (server) como
 * `children`: el fetch server-side hidrata el estado inicial y, al cambiar
 * mes/año, las versiones cliente de cada tarjeta hacen refetch porque
 * cambian sus queryKeys.
 */
export function FiltrosDashboardProvider({
	filtrosIniciales,
	children,
}: {
	filtrosIniciales: FiltrosDashboard
	children: ReactNode
}) {
	const [mes, setMes] = useState(filtrosIniciales.mes)
	const [year, setYear] = useState(filtrosIniciales.year)

	const value = useMemo(
		() => ({ mes, year, setMes, setYear }),
		[mes, year],
	)

	return (
		<FiltrosDashboardContext.Provider value={value}>
			{children}
		</FiltrosDashboardContext.Provider>
	)
}

export function useFiltrosDashboard(): FiltrosDashboardContextValue {
	const contexto = useContext(FiltrosDashboardContext)
	if (!contexto) {
		throw new Error(
			'useFiltrosDashboard debe usarse dentro de FiltrosDashboardProvider',
		)
	}
	return contexto
}
