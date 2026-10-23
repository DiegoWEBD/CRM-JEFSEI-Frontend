import axios from 'axios'
import { HistorialEstadoJson } from './dto/historial-estado-json'

type ObtenerHistorialEstadoResponse = {
  historial: HistorialEstadoJson[]
}

export const obtenerHistorialEstado = async (idProceso: number) => {
  const response = await axios.get<ObtenerHistorialEstadoResponse>(
    `/api/procesos-comerciales/${idProceso}/historial-estado`,
  )
  return response.data.historial
}
