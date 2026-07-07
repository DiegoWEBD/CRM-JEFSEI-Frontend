import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export type ActualizarRecordatorioRequest = {
	titulo: string
	detalle?: string | null
	prioridad: string
	tipo_gestion: string
	fecha_recordatorio: string
	id_prospecto?: number | null
}

export const useActualizarRecordatorio = (id: number) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: ActualizarRecordatorioRequest) =>
			axios.patch(`/api/recordatorios/${id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['recordatorios'],
			})
		},
	})
}
