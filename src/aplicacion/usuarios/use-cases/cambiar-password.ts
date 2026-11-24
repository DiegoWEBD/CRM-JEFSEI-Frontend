import axios from 'axios'

export interface CambiarPasswordRequest {
  password_actual: string
  password_nueva: string
}

export const cambiarPassword = async (rut: string, request: CambiarPasswordRequest) => {
  const response = await axios.put(`/api/usuarios/${rut}/password`, request)
  return response.data
}
