import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

type AsignarPermisosRolParams = {
	codigoRol: string
	codigosPermiso: string[]
}

export const useAsignarPermisosRol = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ codigoRol, codigosPermiso }: AsignarPermisosRolParams) => {
			await axios.put(`/api/roles/${codigoRol}/permisos`, {
				codigos_permiso: codigosPermiso,
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['roles-con-permisos'] })
			toast.success('Permisos del rol actualizados exitosamente')
		},
		onError: () => {
			toast.error('Error al actualizar los permisos del rol')
		},
	})
}
