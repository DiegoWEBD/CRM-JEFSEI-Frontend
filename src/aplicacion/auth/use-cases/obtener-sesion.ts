import { TokenPayload } from '@/dtos/token-payload'

export const obtenerSesion = async (): Promise<TokenPayload | null> => {
	try {
		const response = await fetch('/api/auth/get-session')
		if (!response.ok) return null
		const data: TokenPayload = await response.json()

		return data
	} catch {
		return null
	}
}
