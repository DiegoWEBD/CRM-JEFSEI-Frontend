import {
	ObtenerRolesConPermisosResponse,
	RolConPermisosJson,
} from '@/aplicacion/roles/dtos/rol-con-permisos-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Catálogo de roles con sus permisos asignados, para el panel de
 * administración de roles y permisos.
 *
 * La queryKey debe calzar exactamente con el prefetch del servidor
 * (`panel-inner.tsx`) para que la hidratación sea efectiva.
 */
export const useRolesConPermisos = () => {
	return useQuery<RolConPermisosJson[]>({
		queryKey: ['roles-con-permisos'],
		queryFn: async () => {
			const response = await axios.get<ObtenerRolesConPermisosResponse>(
				'/api/roles/con-permisos',
			)
			return response.data.data
		},
	})
}
