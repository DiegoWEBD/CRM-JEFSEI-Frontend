import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guardarParametrosDepreciacion } from '@/aplicacion/configuracion-condominio/guardar-parametros-depreciacion'
import { invalidarConsultasAlicuota } from '@/hooks/importacion-alicuotas/invalidar-consultas-alicuota'
import { toast } from 'sonner'

export const useGuardarParametrosDepreciacion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: guardarParametrosDepreciacion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['parametros-depreciacion'] })

			// La depreciación alimenta el monto de reconstrucción y el monto
			// sugerido de las unidades de la alícuota.
			invalidarConsultasAlicuota(queryClient)
			toast.success('Parámetros de depreciación guardados')
		},
	})
}
