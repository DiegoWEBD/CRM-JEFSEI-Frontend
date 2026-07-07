import { asignarEjecutivoRenovacion } from '@/aplicacion/prospectos/use-cases/asignar-ejecutivo-renovacion/asignar-ejecutivo-renovacion'
import { AsignarEjecutivoRenovacionRequest } from '@/aplicacion/prospectos/use-cases/asignar-ejecutivo-renovacion/dto/asignar-ejecutivo-renovacion-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAsignarEjecutivoRenovacion = (idProspecto: number, idCliente: number) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: AsignarEjecutivoRenovacionRequest) =>
			asignarEjecutivoRenovacion(idCliente, request),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['prospecto', idProspecto],
			})
		},
	})
}
