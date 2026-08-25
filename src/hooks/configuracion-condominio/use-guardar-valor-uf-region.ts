import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guardarValorUfRegion } from '@/aplicacion/configuracion-condominio/guardar-valor-uf-region'
import { toast } from 'sonner'

export const useGuardarValorUfRegion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: guardarValorUfRegion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['valores-uf-region'] })
			toast.success('Valor UF guardado')
		},
	})
}
