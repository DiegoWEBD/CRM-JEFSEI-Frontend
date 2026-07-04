import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export type RegistrarRecordatorioRequest = {
	titulo: string
	detalle?: string | null
	prioridad: string
	tipo_gestion: string
	fecha_recordatorio: string
	id_prospecto?: number | null
}

export const useRegistrarRecordatorio = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: RegistrarRecordatorioRequest) =>
			axios.post('/api/recordatorios', request),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['recordatorios'],
			})
		},
	})
}
