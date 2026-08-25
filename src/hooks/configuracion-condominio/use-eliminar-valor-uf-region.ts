import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eliminarValorUfRegion } from '@/aplicacion/configuracion-condominio/eliminar-valor-uf-region'
import { toast } from 'sonner'

export const useEliminarValorUfRegion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: eliminarValorUfRegion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['valores-uf-region'] })
			toast.success('Valor UF eliminado')
		},
	})
}
