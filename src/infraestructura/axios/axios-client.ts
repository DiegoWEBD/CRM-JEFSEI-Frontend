import axios from 'axios'
import { headers } from 'next/headers'

export const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Reenvía al backend la IP real, el user-agent y el id de trazabilidad de la
// petición original del navegador. Sin esto, el backend solo ve la IP del
// servidor Next y la auditoría perdería el origen real de cada acción.
axiosClient.interceptors.request.use(async config => {
	try {
		const requestHeaders = await headers()
		const forwardedFor = requestHeaders.get('x-forwarded-for')
		const ipReal =
			forwardedFor?.split(',')[0]?.trim() ||
			requestHeaders.get('x-real-ip')?.trim()
		const userAgent = requestHeaders.get('user-agent')
		const requestId = requestHeaders.get('x-request-id')

		if (ipReal) config.headers['x-real-ip'] = ipReal
		if (userAgent) config.headers['user-agent'] = userAgent
		config.headers['x-request-id'] = requestId || crypto.randomUUID()
	} catch {
		// Fuera del scope de una petición (p. ej. render estático): se envía
		// sin headers de trazabilidad.
	}
	return config
})

axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(error)
	},
)
