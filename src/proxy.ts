import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
	refrescarTokensEnBackend,
	cookieOptionsToken,
	cookieOptionsRefresh,
} from '@/lib/refresh-tokens'

/**
 * Proxy (Next 16 — reemplaza a middleware).
 *
 * Ante un access token expirado con refresh_token válido, rota los tokens
 * contra el backend y los setea en la respuesta (Set-Cookie) + reescribe
 * el header Cookie downstream para que `cookies()` en Server Components
 * vea el token nuevo en el mismo request.
 *
 * Esto corrige el bug original donde un self-fetch desde Server Components
 * descartaba el Set-Cookie y dejaba al navegador con tokens viejos/expirados.
 */
export async function proxy(request: NextRequest) {
	const token = request.cookies.get('token')?.value
	const refreshToken = request.cookies.get('refresh_token')?.value

	// Sin refresh_token → no podemos hacer nada, las páginas manejan sesión null
	if (!refreshToken) {
		return NextResponse.next()
	}

	// Verificar si el access token está expirado (o ausente)
	const tokenValido = token ? !tokenExpirado(token) : false

	if (tokenValido) {
		return NextResponse.next()
	}

	// Token expirado o ausente: intentar refresh contra el backend
	console.log('[proxy] Access token expirado/ausente, intentando refresh...')
	const resultado = await refrescarTokensEnBackend(refreshToken)

	if (!resultado) {
		console.log('[proxy] Refresh falló, continuando sin sesión')
		// No redirigimos aquí: las páginas deciden si requieren auth.
		// Limpiamos cookies inválidas para evitar bucles.
		const res = NextResponse.next()
		res.cookies.set('token', '', { ...cookieOptionsToken(0), maxAge: 0 })
		res.cookies.set('refresh_token', '', {
			...cookieOptionsRefresh(),
			maxAge: 0,
		})
		return res
	}

	console.log('[proxy] Refresh exitoso, seteando nuevos cookies')

	// Construir Cookie header con el token nuevo para que `cookies()` en
	// Server Components (layouts, pages, use cases) lo vea en este request.
	const requestHeaders = new Headers(request.headers)
	const cookieParts: string[] = []
	const cookies = request.cookies.getAll()
	for (const cookie of cookies) {
		const { name, value } = cookie
		if (name === 'token') {
			cookieParts.push(`token=${resultado.access_token}`)
		} else if (name === 'refresh_token') {
			cookieParts.push(`refresh_token=${resultado.refresh_token}`)
		} else {
			cookieParts.push(`${name}=${value}`)
		}
	}
	// Si no existían, agregarlos
	if (!request.cookies.has('token')) {
		cookieParts.push(`token=${resultado.access_token}`)
	}
	if (!request.cookies.has('refresh_token')) {
		cookieParts.push(`refresh_token=${resultado.refresh_token}`)
	}
	requestHeaders.set('cookie', cookieParts.join('; '))

	const response = NextResponse.next({
		request: { headers: requestHeaders },
	})

	// Set-Cookie en la respuesta → el navegador recibe los tokens nuevos
	response.cookies.set(
		'token',
		resultado.access_token,
		cookieOptionsToken(resultado.expire_minutes),
	)
	response.cookies.set(
		'refresh_token',
		resultado.refresh_token,
		cookieOptionsRefresh(),
	)

	return response
}

/** Decodifica el JWT y compara `exp` con ahora (sin verificar firma). */
function tokenExpirado(token: string): boolean {
	try {
		const payload = JSON.parse(
			Buffer.from(token.split('.')[1], 'base64').toString(),
		)
		return payload.exp <= Math.floor(Date.now() / 1000)
	} catch {
		return true
	}
}

export const config = {
	matcher: [
		// Excluir API routes (el BFF tiene su propio refresh),
		// assets estáticos y optimización de imágenes.
		'/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)',
	],
}
