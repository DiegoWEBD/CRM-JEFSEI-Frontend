import { actualizarValorUfM2Personalizado } from '@/aplicacion/prospectos/use-cases/actualizar-valor-uf-m2-personalizado/actualizar-valor-uf-m2-personalizado'
import { invalidarConsultasAlicuota } from '@/hooks/importacion-alicuotas/invalidar-consultas-alicuota'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useActualizarValorUfM2Personalizado(idProspecto: number) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (valor: number | null) =>
			actualizarValorUfM2Personalizado(idProspecto, valor),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['prospecto', idProspecto],
			})

			// El UF/m² personalizado alimenta el monto de reconstrucción y el
			// monto sugerido de las unidades de la alícuota.
			invalidarConsultasAlicuota(queryClient)
		},
	})
}
