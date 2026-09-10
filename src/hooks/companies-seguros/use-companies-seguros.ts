import CompanySeguro from '@/dominio/company-seguro/company-seguro'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseCompaniesSegurosParams = {
	enabled?: boolean
}

export const useCompaniesSeguros = ({ enabled }: UseCompaniesSegurosParams) => {
	return useQuery({
		queryKey: ['companies-seguros'],
		queryFn: async () => {
			const response = await axios.get('/api/companies-seguros')
			const data: CompanySeguro[] = response.data
			return data
		},
		enabled: enabled ?? true,
	})
}
