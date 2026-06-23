import axios from 'axios'

export const aceptarProcesoComercial = async (idProceso: number) => {
  const response = await axios.post(
    `/api/procesos-comerciales/${idProceso}/aceptacion`,
  )
  return response.data as { message: string }
}
