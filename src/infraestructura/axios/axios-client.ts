import axios from 'axios'
import { UnauthorizedError } from '@/lib/errores'

export const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
})

axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (
			axios.isAxiosError(error) &&
			error.response &&
			[401, 403].includes(error.response.status)
		) {
			return Promise.reject(new UnauthorizedError())
		}
		return Promise.reject(error)
	},
)
