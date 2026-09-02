import axios from 'axios'

export const eliminarProducto = async (id: number) => {
	const response = await axios.delete(`/api/productos/${id}`)
	return response.data
}
