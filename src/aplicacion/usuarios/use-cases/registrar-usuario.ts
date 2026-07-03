import axios from 'axios'

export interface RegistrarUsuarioRequest {
	rut: string
	nombre: string
	correo: string
	telefono: string
	id_sucursal: number
	password: string
	meta_mensual_uf: number | null
	codigo_roles: string[]
	porcentaje_comision: number | null
	junior: boolean
}

export const registrarUsuario = async (request: RegistrarUsuarioRequest) => {
	const response = await axios.post('/api/usuarios', request)
	return response.data
}
