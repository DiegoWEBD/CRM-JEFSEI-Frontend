import { obtenerGestionesComerciales } from '@/aplicacion/gestion-comercial/use-cases/obtener-gestiones-comerciales/obtener-gestiones-comerciales'
import type { GestionComercialJson } from '@/aplicacion/gestion-comercial/dto/gestion-comercial-json'
import { useQuery } from '@tanstack/react-query'

export const useObtenerGestionesComerciales = (idProspecto?: number) => {
  return useQuery<GestionComercialJson[]>({
    queryKey: ['gestiones-comerciales', idProspecto],
    queryFn: () => obtenerGestionesComerciales(idProspecto),
  })
}
