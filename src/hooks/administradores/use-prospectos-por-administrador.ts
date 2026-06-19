import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useProspectosPorAdministrador = (
	id: number,
	enabled?: boolean,
) => {
	return useQuery<ProspectoResumenJson[]>({
		queryKey: ['administradores', id, 'prospectos'],
		queryFn: async () => {
			const response = await axios.get(
				`/api/administradores/${id}/prospectos`,
			)
			return response.data
		},
		enabled,
	})
}
