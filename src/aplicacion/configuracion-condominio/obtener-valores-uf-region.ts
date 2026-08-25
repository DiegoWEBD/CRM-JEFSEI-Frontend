import axios from 'axios'
import { ValorUfRegion } from '@/dominio/configuracion-condominio/valor-uf-region'

export const obtenerValoresUfRegion = async (): Promise<ValorUfRegion[]> => {
	const response = await axios.get('/api/configuracion-condominio/valor-uf-region')
	return response.data.data ?? []
}
