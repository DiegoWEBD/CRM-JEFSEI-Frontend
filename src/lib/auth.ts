import { cookies } from 'next/headers'
import { TokenPayload } from '@/dtos/token-payload'

/**
 * Obtiene la sesión del usuario decodificando el JWT del access token.
 *
 * Solo lectura: NO refresca tokens (eso lo hace proxy.ts en page loads
 * y /api/auth/refresh en SPA). Si el token expiró devuelve null.
 */
export async function getSession(): Promise<TokenPayload | null> {
	const cookieStore = await cookies()

	const token = cookieStore.get('token')?.value

	if (!token) return null

	try {
		const payload: TokenPayload = JSON.parse(
			Buffer.from(token.split('.')[1], 'base64').toString(),
		)

		const nowInSeconds = Math.floor(Date.now() / 1000)

		if (payload.exp > nowInSeconds) {
			return payload
		}

		// Token expirado: el proxy ya se encargó de refrescar en page loads.
		// Si llegamos aquí, no había refresh_token válido.
		return null
	} catch {
		return null
	}
}

export async function hasRole(role: string) {
	const session = await getSession()

	if (!session) return false

	return session.codigo_roles.includes(role)
}

export async function hasSomeRole(roles: string[]) {
	const session = await getSession()

	if (!session) return false

	return session.codigo_roles.some(role => roles.includes(role))
}