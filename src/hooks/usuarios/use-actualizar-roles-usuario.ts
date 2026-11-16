import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

type ActualizarRolesUsuarioParams = {
	rut: string
	codigoRoles: string[]
}

export const useActualizarRolesUsuario = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ rut, codigoRoles }: ActualizarRolesUsuarioParams) => {
			await axios.put(`/api/usuarios/${rut}/roles`, {
				codigo_roles: codigoRoles,
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['usuarios'] })
			toast.success('Roles del usuario actualizados exitosamente')
		},
		onError: () => {
			toast.error('Error al actualizar los roles del usuario')
		},
	})
}
