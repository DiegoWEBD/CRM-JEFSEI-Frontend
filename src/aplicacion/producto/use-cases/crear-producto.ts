import axios from 'axios'

export interface CrearProductoRequest {
	nombre: string
	id_linea_negocio: number
	codigo: string | null
}

export const crearProducto = async (request: CrearProductoRequest) => {
	const response = await axios.post('/api/productos', request)
	return response.data
}
