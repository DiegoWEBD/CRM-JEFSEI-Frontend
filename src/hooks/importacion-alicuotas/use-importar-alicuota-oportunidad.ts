import {
	importarAlicuotaOportunidad,
	ImportarAlicuotaOportunidadRequest,
} from '@/aplicacion/importacion-alicuotas/use-cases/importar-alicuota-oportunidad/importar-alicuota-oportunidad'
import { invalidarConsultasAlicuota } from '@/hooks/importacion-alicuotas/invalidar-consultas-alicuota'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useImportarAlicuotaOportunidad = (idProceso: number) => {
	const queryClient = useQueryClient()

	return useMutation<void, Error, ImportarAlicuotaOportunidadRequest>({
		mutationFn: (request: ImportarAlicuotaOportunidadRequest) =>
			importarAlicuotaOportunidad(idProceso, request),
		onSuccess: () => {
			invalidarConsultasAlicuota(queryClient, idProceso)
		},
	})
}
