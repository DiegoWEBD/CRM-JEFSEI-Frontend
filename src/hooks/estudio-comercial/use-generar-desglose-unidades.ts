import { generarDesgloseUnidades } from '@/aplicacion/estudio-comercial/use-cases/generar-desglose-unidades/generar-desglose-unidades'
import { GenerarDesgloseUnidadesRequest } from '@/aplicacion/estudio-comercial/use-cases/generar-desglose-unidades/dto/generar-desglose-unidades-request'
import { useMutation } from '@tanstack/react-query'

export const useGenerarDesgloseUnidades = () => {
	return useMutation<Blob, Error, GenerarDesgloseUnidadesRequest>({
		mutationFn: (request: GenerarDesgloseUnidadesRequest) =>
			generarDesgloseUnidades(request),
	})
}
