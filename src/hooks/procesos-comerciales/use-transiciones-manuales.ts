import { obtenerTransicionesManuales } from '@/aplicacion/procesos-comerciales/use-cases/obtener-transiciones-manuales/obtener-transiciones-manuales'
import { useQuery } from '@tanstack/react-query'

export const useTransicionesManuales = (idProceso: number) => {
  return useQuery({
    queryKey: ['transiciones-manuales', idProceso],
    queryFn: () => obtenerTransicionesManuales(idProceso),
  })
}
