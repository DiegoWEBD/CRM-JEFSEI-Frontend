import axios from 'axios'
import { ValorUfRegion } from '@/dominio/configuracion-condominio/valor-uf-region'

interface GuardarValorUfRegionRequest {
	id?: number
	region: string
	valor_uf_m2: number
}

export const guardarValorUfRegion = async (request: GuardarValorUfRegionRequest): Promise<ValorUfRegion> => {
	const response = await axios.put('/api/configuracion-condominio/valor-uf-region', request)
	return response.data.data
}
