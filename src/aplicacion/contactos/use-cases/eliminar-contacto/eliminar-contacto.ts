import axios from 'axios'

export const eliminarContacto = async (id: number): Promise<string> => {
	const response = await axios.delete(`/api/contactos/${id}`)
	return response.data.message
}