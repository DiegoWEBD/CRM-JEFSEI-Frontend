import { useQuery } from '@tanstack/react-query'
import { obtenerParametrosDepreciacion } from '@/aplicacion/configuracion-condominio/obtener-parametros-depreciacion'

export const useParametrosDepreciacion = () => {
	return useQuery({
		queryKey: ['parametros-depreciacion'],
		queryFn: obtenerParametrosDepreciacion,
	})
}
