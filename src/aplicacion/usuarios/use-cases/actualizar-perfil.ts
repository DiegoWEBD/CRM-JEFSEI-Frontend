import axios from 'axios'

export interface ActualizarPerfilRequest {
  nombre: string
}

export const actualizarPerfil = async (rut: string, request: ActualizarPerfilRequest) => {
  const response = await axios.patch(`/api/usuarios/${rut}`, request)
  return response.data
}
