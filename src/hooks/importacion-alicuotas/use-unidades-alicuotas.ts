import type { ObtenerUnidadesAlicuotasResponse } from '@/aplicacion/importacion-alicuotas/use-cases/obtener-unidades-alicuotas/obtener-unidades-alicuotas'
import { obtenerUnidadesAlicuotas } from '@/aplicacion/importacion-alicuotas/use-cases/obtener-unidades-alicuotas/obtener-unidades-alicuotas'
import { useQuery } from '@tanstack/react-query'

export const useUnidadesAlicuotas = (idSolicitud: number, habilitado = true) => {
  return useQuery<ObtenerUnidadesAlicuotasResponse, Error>({
    queryKey: ['unidades-alicuotas', idSolicitud],
    queryFn: () => obtenerUnidadesAlicuotas(idSolicitud),
    enabled: habilitado && idSolicitud > 0,
  })
}
