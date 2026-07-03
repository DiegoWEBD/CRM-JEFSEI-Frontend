import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export type RegistrarComunicadoRequest = {
	titulo: string
	descripcion: string
	prioridad: string
	caducidad: string
}

export const useRegistrarComunicadoGerencia = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: RegistrarComunicadoRequest) =>
			axios.post('/api/comunicados-gerencia', request),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['comunicados-gerencia'],
			})
		},
	})
}
