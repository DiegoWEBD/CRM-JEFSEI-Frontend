'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface EtapaProcesoComercial {
	codigo: string
	nombre: string
}

export const useEtapasProcesoComerciales = () => {
	return useQuery<EtapaProcesoComercial[]>({
		queryKey: ['etapas-proceso-comerciales'],
		queryFn: async () => {
			const response = await axios.get('/api/etapas-proceso-comercial')
			return response.data
		},
	})
}
