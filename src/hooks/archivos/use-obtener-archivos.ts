import type Archivo from '@/dominio/archivo/archivo'
import { obtenerArchivos } from '@/aplicacion/archivos/use-cases/obtener-archivos/obtener-archivos'
import { useQuery } from '@tanstack/react-query'

export const useObtenerArchivos = (idProspecto: number) => {
	return useQuery<Archivo[]>({
		queryKey: ['archivos', idProspecto],
		queryFn: () => obtenerArchivos(idProspecto),
	})
}
