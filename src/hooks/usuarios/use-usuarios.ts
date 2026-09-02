import { ObtenerUsuariosResponse } from '@/aplicacion/usuarios/dtos/obtener-usuarios-response'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseUsuariosParams = {
	texto_busqueda?: string
	pagina?: number
	tamano_pagina?: number
}

export const useUsuarios = (filtros: UseUsuariosParams) => {
	const {
		texto_busqueda,
		pagina = 1,
		tamano_pagina = 15,
	} = filtros

	return useQuery<ObtenerUsuariosResponse>({
		queryKey: ['usuarios', texto_busqueda, pagina, tamano_pagina],
		queryFn: async () => {
			const params = new URLSearchParams()
			if (texto_busqueda) params.set('texto_busqueda', texto_busqueda)
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamano_pagina))

			const response = await axios.get(`/api/usuarios?${params.toString()}`)
			return response.data as ObtenerUsuariosResponse
		},
	})
}
