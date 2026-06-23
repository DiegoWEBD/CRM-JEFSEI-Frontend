import axios from 'axios'
import { HistorialEtapaResumen } from './dto/historial-etapa-resumen'

type ObtenerHistorialEstadoResponse = {
  historial: Record<string, HistorialEtapaResumen>
}

export const obtenerHistorialEstado = async (idProceso: number) => {
  const response = await axios.get<ObtenerHistorialEstadoResponse>(
    `/api/procesos-comerciales/${idProceso}/historial-estado`,
  )
  return response.data.historial
}
