import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guardarParametrosDepreciacion } from '@/aplicacion/configuracion-condominio/guardar-parametros-depreciacion'
import { toast } from 'sonner'

export const useGuardarParametrosDepreciacion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: guardarParametrosDepreciacion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['parametros-depreciacion'] })
			toast.success('Parámetros de depreciación guardados')
		},
	})
}
