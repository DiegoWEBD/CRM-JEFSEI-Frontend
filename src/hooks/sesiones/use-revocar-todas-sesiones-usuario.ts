import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

export const useRevocarTodasSesionesUsuario = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (rutUsuario: string) => {
			await axios.patch(`/api/sesiones/usuario/${rutUsuario}/revocar-todas`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sesiones'] })
			toast.success('Todas las sesiones del usuario han sido revocadas')
		},
		onError: () => {
			toast.error('Error al revocar las sesiones del usuario')
		},
	})
}