import { obtenerTransicionesEstado } from '@/aplicacion/estados-admin/use-cases/obtener-transiciones-estado'
import { useQuery } from '@tanstack/react-query'

/**
 * Transiciones (principales y secundarias) desde el estado indicado.
 *
 * Solo consulta cuando hay un estado seleccionado.
 */
export const useTransicionesEstado = (codigoEstado: string | null) => {
	return useQuery({
		queryKey: ['transiciones-estado', codigoEstado],
		queryFn: () => obtenerTransicionesEstado(codigoEstado as string),
		enabled: !!codigoEstado,
	})
}
