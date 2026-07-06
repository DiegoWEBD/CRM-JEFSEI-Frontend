import axios from 'axios'

import type { GestionComercialJson } from '../../dto/gestion-comercial-json'

export const obtenerUltimaGestionComercial = async (
  idProspecto: number,
): Promise<GestionComercialJson | null> => {
  const response = await axios.get('/api/gestiones-comerciales/final', {
    params: { id_prospecto: idProspecto },
  })
  return (response.data as GestionComercialJson) ?? null
}
