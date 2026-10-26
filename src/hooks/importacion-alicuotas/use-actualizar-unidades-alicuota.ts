import {
	actualizarUnidadesAlicuota,
} from '@/aplicacion/importacion-alicuotas/use-cases/actualizar-unidades-alicuota/actualizar-unidades-alicuota'
import type {
	ActualizarUnidadesAlicuotaRequest,
	ActualizarUnidadesAlicuotaResponse,
} from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { invalidarConsultasAlicuota } from '@/hooks/importacion-alicuotas/invalidar-consultas-alicuota'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useActualizarUnidadesAlicuota = (idProceso: number) => {
	const queryClient = useQueryClient()

	return useMutation<
		ActualizarUnidadesAlicuotaResponse,
		Error,
		ActualizarUnidadesAlicuotaRequest
	>({
		mutationFn: request => actualizarUnidadesAlicuota(idProceso, request),
		onSettled: () => {
			invalidarConsultasAlicuota(queryClient, idProceso)
		},
	})
}
