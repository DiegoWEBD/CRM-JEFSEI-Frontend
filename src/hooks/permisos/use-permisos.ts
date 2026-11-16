import { ObtenerPermisosResponse } from '@/aplicacion/permisos/dtos/obtener-permisos-response'
import { PermisoJson } from '@/aplicacion/roles/dtos/rol-con-permisos-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Catálogo completo de permisos del sistema.
 *
 * La queryKey debe calzar exactamente con el prefetch del servidor
 * (`panel-inner.tsx`) para que la hidratación sea efectiva.
 */
export const usePermisos = () => {
	return useQuery<PermisoJson[]>({
		queryKey: ['permisos'],
		queryFn: async () => {
			const response = await axios.get<ObtenerPermisosResponse>('/api/permisos')
			return response.data.data
		},
	})
}
