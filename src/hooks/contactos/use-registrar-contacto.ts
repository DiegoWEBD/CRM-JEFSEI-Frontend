import type { RegistrarContactoRequest } from '@/aplicacion/contactos/use-cases/registrar-contacto/dto/registrar-contacto-request'
import { registrarContacto } from '@/aplicacion/contactos/use-cases/registrar-contacto/registrar-contacto'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useRegistrarContacto = (idProspecto: number) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: RegistrarContactoRequest) =>
			registrarContacto(idProspecto, request),
		onSuccess: (data) => {
			toast.success(data.message)
			queryClient.invalidateQueries({ queryKey: ['contactos', idProspecto] })
		},
	})
}