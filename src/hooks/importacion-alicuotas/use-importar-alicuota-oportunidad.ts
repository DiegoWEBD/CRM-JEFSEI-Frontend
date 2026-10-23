import {
	importarAlicuotaOportunidad,
	ImportarAlicuotaOportunidadRequest,
} from '@/aplicacion/importacion-alicuotas/use-cases/importar-alicuota-oportunidad/importar-alicuota-oportunidad'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useImportarAlicuotaOportunidad = (idProceso: number) => {
	const queryClient = useQueryClient()

	return useMutation<void, Error, ImportarAlicuotaOportunidadRequest>({
		mutationFn: (request: ImportarAlicuotaOportunidadRequest) =>
			importarAlicuotaOportunidad(idProceso, request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['alicuota-oportunidad', idProceso] })
			queryClient.invalidateQueries({ queryKey: ['desglose-reconstruccion', idProceso] })
		},
	})
}
