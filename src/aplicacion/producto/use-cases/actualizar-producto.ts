import axios from 'axios'

export interface ActualizarProductoRequest {
	id: number
	nombre: string
	id_linea_negocio: number
	codigo: string | null
}

export const actualizarProducto = async (request: ActualizarProductoRequest) => {
	const response = await axios.put(`/api/productos/${request.id}`, request)
	return response.data
}
