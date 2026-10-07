/**
 * Helper para rotar tokens contra el backend.
 * Usado por proxy.ts (page loads) y /api/auth/refresh (SPA interceptor).
 */

import { TokenPayload } from '@/dtos/token-payload'

export type RefreshTokensResult = {
	access_token: string
	refresh_token: string
	expire_minutes: number
}

/**
 * Llama al backend POST /auth/refresh para rotar tokens.
 * Devuelve los nuevos tokens o null si falla.
 */
export async function refrescarTokensEnBackend(
	refreshToken: string,
): Promise<RefreshTokensResult | null> {
	try {
		const apiUrl = process.env.API_URL
		if (!apiUrl) return null

		const res = await fetch(`${apiUrl}/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: refreshToken }),
		})

		if (!res.ok) return null

		return res.json()
	} catch {
		return null
	}
}

/**
 * Decodifica el payload de un access token JWT sin verificar la firma.
 * Útil en el cliente/proxy para extraer claims después de un refresh.
 */
export function decodificarAccessToken(token: string): TokenPayload | null {
	try {
		return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
	} catch {
		return null
	}
}

/** Opciones comunes para las cookies de autenticación. */
export function cookieOptionsToken(expireMinutes: number) {
	return {
		httpOnly: true as const,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		path: '/',
		maxAge: expireMinutes * 60,
	}
}

export function cookieOptionsRefresh() {
	return {
		httpOnly: true as const,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		path: '/',
		maxAge: 30 * 24 * 60 * 60, // 30 días
	}
}
