import Recordatorio from '@/dominio/recordatorio/recordatorio'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useProximoContacto = (rut: string, idProspecto: number) => {
	return useQuery<Recordatorio | null>({
		queryKey: ['proximo-contacto', rut, idProspecto],
		queryFn: async () => {
			const response = await axios.get(
				`/api/usuarios/${rut}/recordatorios/proximo-contacto`,
				{ params: { id_prospecto: idProspecto }, withCredentials: true },
			)
			return response.data?.data ?? null
		},
		enabled: !!rut && !!idProspecto,
	})
}
