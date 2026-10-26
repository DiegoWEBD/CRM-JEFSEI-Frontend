import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guardarValorUfRegion } from '@/aplicacion/configuracion-condominio/guardar-valor-uf-region'
import { invalidarConsultasAlicuota } from '@/hooks/importacion-alicuotas/invalidar-consultas-alicuota'
import { toast } from 'sonner'

export const useGuardarValorUfRegion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: guardarValorUfRegion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['valores-uf-region'] })

			// El valor UF por región alimenta el monto de reconstrucción y el
			// monto sugerido de las unidades de la alícuota.
			invalidarConsultasAlicuota(queryClient)
			toast.success('Valor UF guardado')
		},
	})
}
