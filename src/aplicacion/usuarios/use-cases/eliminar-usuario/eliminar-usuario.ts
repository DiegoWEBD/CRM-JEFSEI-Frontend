import axios from 'axios'

export const eliminarUsuario = async (rut: string) => {
	const response = await axios.delete(`/api/usuarios/${rut}`)
	return response.data
}
