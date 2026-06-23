import { HistorialEtapaResumen } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/dto/historial-etapa-resumen'
import { obtenerHistorialEstado } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/obtener-historial-estado'
import { useQuery } from '@tanstack/react-query'

export const useObtenerHistorialEstado = (idProceso: number) => {
  return useQuery<Record<string, HistorialEtapaResumen>>({
    queryKey: ['historial-estado', idProceso],
    queryFn: () => obtenerHistorialEstado(idProceso),
    enabled: idProceso > 0,
  })
}
