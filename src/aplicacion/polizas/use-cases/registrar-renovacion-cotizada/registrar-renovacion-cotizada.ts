import axios from 'axios'

export const registrarRenovacionCotizada = async (numeroPoliza: string) => {
  const response = await axios.post(
    `/api/polizas/${numeroPoliza}/registrar-renovacion-cotizada`,
  )
  return response.data
}
