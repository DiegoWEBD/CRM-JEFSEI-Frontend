import { descargarDesgloseReconstruccion } from '@/aplicacion/importacion-alicuotas/use-cases/descargar-desglose-reconstruccion/descargar-desglose-reconstruccion'
import { useMutation } from '@tanstack/react-query'

export const useDescargarDesgloseReconstruccion = () => {
	return useMutation<Blob, Error, number>({
		mutationFn: (idProceso: number) => descargarDesgloseReconstruccion(idProceso),
	})
}
