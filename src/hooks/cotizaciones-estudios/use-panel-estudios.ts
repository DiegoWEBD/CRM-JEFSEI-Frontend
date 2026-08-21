import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const usePanelEstudios = (initialData?: PanelEstudioFila[]) => {
	return useQuery<PanelEstudioFila[]>({
		queryKey: ['panel-estudios'],
		queryFn: async () => {
			const response = await axios.get('/api/estudio-comercial/panel')
			return response.data
		},
		initialData,
	})
}
