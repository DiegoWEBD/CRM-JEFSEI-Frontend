'use client'

import type { FiltrosProcesosComerciales } from '@/aplicacion/procesos-comerciales/dto/filtros-procesos-comerciales'
import type { ReporteProcesoComercial } from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useReportesProcesosComerciales = (
	filtros: FiltrosProcesosComerciales,
	initialData?: ReporteProcesoComercial[],
) => {
	return useQuery<ReporteProcesoComercial[]>({
		queryKey: ['reportes-procesos-comerciales', filtros],
		queryFn: async () => {
			const response = await axios.post(
				'/api/procesos-comerciales/reportes',
				filtros,
			)
			return response.data
		},
		initialData,
		staleTime: 60000,
	})
}
