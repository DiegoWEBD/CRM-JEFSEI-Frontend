import { TokenPayload } from '@/dtos/token-payload'
import axios from 'axios'

export const obtenerSesion = async (): Promise<TokenPayload | null> => {
	try {
		const response = await axios.get('/api/auth/get-session')
		const data: TokenPayload = response.data

		return data
	} catch {
		return null
	}
}
