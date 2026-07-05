import type { RegistrarAdministradorRequest } from '@/aplicacion/administradores/use-cases/registrar-administrador/dto/registrar-administrador-request'
import { registrarAdministrador } from '@/aplicacion/administradores/use-cases/registrar-administrador/registrar-administrador'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRegistrarAdministrador = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: RegistrarAdministradorRequest) =>
			registrarAdministrador(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['administradores'] })
		},
	})
}
