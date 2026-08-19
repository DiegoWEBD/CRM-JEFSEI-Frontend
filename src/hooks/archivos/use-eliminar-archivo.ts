import { eliminarArchivo } from '@/aplicacion/archivos/use-cases/eliminar-archivo/eliminar-archivo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEliminarArchivo = (idProspecto: number) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (idArchivo: number) => eliminarArchivo(idProspecto, idArchivo),
		onSuccess: (message) => {
			toast.success(message)
			queryClient.invalidateQueries({ queryKey: ['archivos', idProspecto] })
		},
	})
}
