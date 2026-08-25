import axios from 'axios'

export const eliminarValorUfRegion = async (id: number): Promise<void> => {
	await axios.delete(`/api/configuracion-condominio/valor-uf-region/${id}`)
}
