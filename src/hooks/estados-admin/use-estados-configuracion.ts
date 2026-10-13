import {
	ObtenerEstadosConfiguracionResponse,
} from '@/aplicacion/estados-admin/dto/estado-configuracion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Configuración de todos los estados del proceso comercial.
 *
 * La queryKey debe calzar exactamente con el prefetch del servidor
 * (`panel-inner.tsx`) para que la hidratación sea efectiva.
 */
export const useEstadosConfiguracion = () => {
	return useQuery({
		queryKey: ['estados-configuracion'],
		queryFn: async () => {
			const response = await axios.get<ObtenerEstadosConfiguracionResponse>(
				'/api/estados/configuracion',
			)
			return response.data
		},
	})
}
