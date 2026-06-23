import type { ReporteProcesoComercial } from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import type { FiltrosProcesosComerciales } from '@/aplicacion/procesos-comerciales/dto/filtros-procesos-comerciales'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'

export const obtenerReportesProcesosComerciales = async (
	filtros: FiltrosProcesosComerciales,
): Promise<ReporteProcesoComercial[]> => {
	const cookieStore = await cookies()
	const axiosResponse = await axiosClient.post(
		'/procesos-comerciales/reportes',
		filtros,
		{ headers: { Cookie: cookieStore.toString() } },
	)
	const data: ReporteProcesoComercial[] = axiosResponse.data
	return data
}
