import {
	subirArchivo,
	type SubirArchivoResponse,
} from '@/aplicacion/archivos/use-cases/subir-archivo/subir-archivo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useSubirArchivo = (idProspecto: number) => {
	const queryClient = useQueryClient()

	return useMutation<SubirArchivoResponse, Error, { archivo: File }>({
		mutationFn: ({ archivo }) => subirArchivo(idProspecto, archivo),
		onSuccess: (data) => {
			toast.success(data.message)
			queryClient.invalidateQueries({ queryKey: ['archivos', idProspecto] })
		},
	})
}
