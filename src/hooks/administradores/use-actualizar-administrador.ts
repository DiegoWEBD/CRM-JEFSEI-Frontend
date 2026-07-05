import type { ActualizarAdministradorRequest } from '@/aplicacion/administradores/use-cases/actualizar-administrador/dto/actualizar-administrador-request'
import { actualizarAdministrador } from '@/aplicacion/administradores/use-cases/actualizar-administrador/actualizar-administrador'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useActualizarAdministrador = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number
			data: ActualizarAdministradorRequest
		}) => actualizarAdministrador(id, data),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['administradores'] })
			queryClient.invalidateQueries({
				queryKey: ['administrador', variables.id],
			})
		},
	})
}
