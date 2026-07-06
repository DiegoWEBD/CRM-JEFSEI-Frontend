import axios from 'axios'

import type { GestionComercialJson } from '../../dto/gestion-comercial-json'

export const obtenerGestionesComerciales = async (
  idProspecto?: number,
): Promise<GestionComercialJson[]> => {
  const params = idProspecto !== undefined ? { id_prospecto: idProspecto } : undefined
  const response = await axios.get('/api/gestiones-comerciales', { params })
  const data = response.data as { gestiones: GestionComercialJson[] }
  return data.gestiones ?? []
}
