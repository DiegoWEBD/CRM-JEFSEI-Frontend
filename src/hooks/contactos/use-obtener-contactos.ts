import Contacto from '@/dominio/contacto/contacto'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useObtenerContactos = (
	idProspecto: number,
	contactosIniciales?: Contacto[],
) => {
	return useQuery<Contacto[]>({
		queryKey: ['contactos', idProspecto],
		queryFn: async () => {
			const response = await axios.get(`/api/prospectos/${idProspecto}/contactos`)
			return response.data.data
		},
		initialData: contactosIniciales,
	})
}