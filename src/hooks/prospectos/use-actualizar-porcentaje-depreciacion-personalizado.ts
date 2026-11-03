import { actualizarPorcentajeDepreciacionPersonalizado } from '@/aplicacion/prospectos/use-cases/actualizar-porcentaje-depreciacion-personalizado/actualizar-porcentaje-depreciacion-personalizado'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useActualizarPorcentajeDepreciacionPersonalizado(
	idProspecto: number,
) {
	const queryClient = useQueryClient()

	return useMutation({
		// El valor se recibe en puntos porcentuales (20 = 20%) y el caso de uso
		// lo convierte a fracción (0.20) antes de enviarlo al backend.
		mutationFn: (porcentaje: number | null) =>
			actualizarPorcentajeDepreciacionPersonalizado(idProspecto, porcentaje),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['prospecto', idProspecto],
			})
		},
	})
}
