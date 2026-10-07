import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

export const useRevocarSesion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (sesionId: string) => {
			await axios.patch(`/api/sesiones/${sesionId}/revocar`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sesiones'] })
			toast.success('Sesión revocada exitosamente')
		},
		onError: () => {
			toast.error('Error al revocar la sesión')
		},
	})
}