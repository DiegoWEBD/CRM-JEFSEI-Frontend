import { asignarEjecutivoCobranza } from '@/aplicacion/prospectos/use-cases/asignar-ejecutivo-cobranza/asignar-ejecutivo-cobranza'
import { AsignarEjecutivoCobranzaRequest } from '@/aplicacion/prospectos/use-cases/asignar-ejecutivo-cobranza/dto/asignar-ejecutivo-cobranza-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAsignarEjecutivoCobranza = (idProspecto: number, idCliente: number) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: AsignarEjecutivoCobranzaRequest) =>
			asignarEjecutivoCobranza(idCliente, request),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['prospecto', idProspecto],
			})
		},
	})
}
