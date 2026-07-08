import axios from 'axios'

export interface ActualizarUsuarioRequest {
  rut: string
  nombre: string
    correo: string | null
    telefono: string | null
  id_sucursal: number
  meta_mensual_uf: number | null
  codigo_roles: string[]
  porcentaje_comision: number | null
  habilitado: boolean
}

export const actualizarUsuario = async (request: ActualizarUsuarioRequest) => {
  const response = await axios.put(`/api/usuarios/${request.rut}`, request)
  return response.data
}
