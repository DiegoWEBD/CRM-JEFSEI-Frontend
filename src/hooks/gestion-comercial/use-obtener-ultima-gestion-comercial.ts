import { obtenerUltimaGestionComercial } from '@/aplicacion/gestion-comercial/use-cases/obtener-ultima-gestion-comercial/obtener-ultima-gestion-comercial'
import type { GestionComercialJson } from '@/aplicacion/gestion-comercial/dto/gestion-comercial-json'
import { useQuery } from '@tanstack/react-query'

export const useObtenerUltimaGestionComercial = (idProspecto: number) => {
  return useQuery<GestionComercialJson | null>({
    queryKey: ['gestion-comercial-final', idProspecto],
    queryFn: () => obtenerUltimaGestionComercial(idProspecto),
  })
}
