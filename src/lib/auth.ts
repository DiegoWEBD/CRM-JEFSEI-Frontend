import { cookies } from 'next/headers'
import { TokenPayload } from '@/dtos/token-payload'

export async function getSession() {
	const cookieStore = await cookies()

	const token = cookieStore.get('token')?.value

	if (!token) return null

	try {
		const payload: TokenPayload = JSON.parse(
			Buffer.from(token.split('.')[1], 'base64').toString(),
		)

		return payload
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
