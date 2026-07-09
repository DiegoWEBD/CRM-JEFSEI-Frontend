import { DashboardCobranza } from '@/dominio/cobranza/dashboard-cobranza'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useDashboardCobranza = (
	initialData?: DashboardCobranza,
	enabled = true,
) => {
	return useQuery({
		queryKey: ['dashboard-cobranza'],
		queryFn: async () => {
			const response = await axios.get('/api/cobranza/dashboard')
			const data: DashboardCobranza = response.data
			return data
		},
		initialData,
		enabled,
	})
}
