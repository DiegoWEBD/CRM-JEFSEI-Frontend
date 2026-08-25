import { useQuery } from '@tanstack/react-query'
import { obtenerValoresUfRegion } from '@/aplicacion/configuracion-condominio/obtener-valores-uf-region'

export const useValoresUfRegion = () => {
	return useQuery({
		queryKey: ['valores-uf-region'],
		queryFn: obtenerValoresUfRegion,
	})
}
