import { HistorialEstadoJson } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/dto/historial-estado-json'
import { obtenerHistorialEstado } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/obtener-historial-estado'
import { useQuery } from '@tanstack/react-query'

export const useObtenerHistorialEstado = (idProceso: number) => {
	return useQuery<HistorialEstadoJson[]>({
		queryKey: ['historial-estado', idProceso],
		queryFn: () => obtenerHistorialEstado(idProceso),
		enabled: idProceso > 0,
	})
}
