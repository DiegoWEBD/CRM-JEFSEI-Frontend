import type { ActualizarContactoRequest } from '@/aplicacion/contactos/use-cases/actualizar-contacto/dto/actualizar-contacto-request'
import { actualizarContacto } from '@/aplicacion/contactos/use-cases/actualizar-contacto/actualizar-contacto'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useActualizarContacto = (idProspecto: number) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number
			data: ActualizarContactoRequest
		}) => actualizarContacto(id, data),
		onSuccess: (data) => {
			toast.success(data.message)
			queryClient.invalidateQueries({ queryKey: ['contactos', idProspecto] })
		},
	})
}