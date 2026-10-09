import { obtenerTransicionesManuales } from '@/aplicacion/estados/use-cases/obtener-transiciones-manuales/obtener-transiciones-manuales'
import { useQuery } from '@tanstack/react-query'

export const useTransicionesManuales = (codigoEstado: string) => {
	return useQuery({
		queryKey: ['transiciones-manuales', codigoEstado],
		queryFn: () => obtenerTransicionesManuales(codigoEstado),
		enabled: !!codigoEstado,
	})
}
