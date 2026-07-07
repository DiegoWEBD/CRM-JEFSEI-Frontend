import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface RolJson {
	codigo: string
	nombre: string
}

export interface ObtenerRolesResponse {
	roles: RolJson[]
}

export const useObtenerRoles = () => {
	return useQuery<RolJson[]>({
		queryKey: ['roles'],
		queryFn: async () => {
			const response = await axios.get('/api/roles')
			const data: ObtenerRolesResponse = response.data
			return data.roles
		},
	})
}
