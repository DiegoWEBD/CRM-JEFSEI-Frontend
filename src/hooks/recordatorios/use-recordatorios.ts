import Recordatorio from '@/dominio/recordatorio/recordatorio'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseRecordatoriosProps = {
	fecha: string
	id_prospecto?: number
}

export const useRecordatorios = ({
	fecha,
	id_prospecto,
}: UseRecordatoriosProps) => {
	return useQuery({
		queryKey: ['recordatorios', fecha, id_prospecto],

		queryFn: async () => {
			let endpoint = `/api/recordatorios?fecha=${fecha}`

			if (id_prospecto) {
				endpoint += `&id_prospecto=${id_prospecto}`
			}

			const response = await axios.get(endpoint, {
				withCredentials: true,
			})

			const data: Recordatorio[] = response.data
			return data
		},
	})
}
