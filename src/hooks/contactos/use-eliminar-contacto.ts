import { eliminarContacto } from '@/aplicacion/contactos/use-cases/eliminar-contacto/eliminar-contacto'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEliminarContacto = (idProspecto: number) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => eliminarContacto(id),
		onSuccess: (data) => {
			toast.success(data)
			queryClient.invalidateQueries({ queryKey: ['contactos', idProspecto] })
		},
	})
}