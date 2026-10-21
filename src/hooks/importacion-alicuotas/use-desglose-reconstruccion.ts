import { obtenerDesgloseReconstruccion } from '@/aplicacion/importacion-alicuotas/use-cases/obtener-desglose-reconstruccion/obtener-desglose-reconstruccion'
import { useQuery } from '@tanstack/react-query'

export const useDesgloseReconstruccion = (idProceso: number) => {
	return useQuery({
		queryKey: ['desglose-reconstruccion', idProceso],
		queryFn: () => obtenerDesgloseReconstruccion(idProceso),
		enabled: !!idProceso,
	})
}
