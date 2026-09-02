import Recordatorio from '@/dominio/recordatorio/recordatorio'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseRecordatoriosProps = {
	fecha: string
	id_prospecto?: number
	pagina?: number
	tamano_pagina?: number
}

type RecordatoriosPaginadosResponse = {
	data: Recordatorio[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
}

export const useRecordatorios = ({
	fecha,
	id_prospecto,
	pagina = 1,
	tamano_pagina = 15,
}: UseRecordatoriosProps) => {
	return useQuery({
		queryKey: ['recordatorios', fecha, id_prospecto, pagina, tamano_pagina],

		queryFn: async () => {
			let endpoint = `/api/recordatorios?fecha=${fecha}&pagina=${pagina}&tamano_pagina=${tamano_pagina}`

			if (id_prospecto) {
				endpoint += `&id_prospecto=${id_prospecto}`
			}

			const response = await axios.get(endpoint, {
				withCredentials: true,
			})

			const data: RecordatoriosPaginadosResponse = response.data
			return data
		},
	})
}
