import { obtenerAlicuotaOportunidad } from '@/aplicacion/importacion-alicuotas/use-cases/obtener-alicuota-oportunidad/obtener-alicuota-oportunidad'
import { useQuery } from '@tanstack/react-query'

export const useAlicuotaOportunidad = (idProceso: number) => {
	return useQuery({
		queryKey: ['alicuota-oportunidad', idProceso],
		queryFn: () => obtenerAlicuotaOportunidad(idProceso),
		enabled: !!idProceso,
	})
}
