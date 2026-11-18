import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
	refrescarTokensEnBackend,
	cookieOptionsToken,
	cookieOptionsRefresh,
	type RefreshTokensResult,
} from '@/lib/refresh-tokens'
import { destinoSeguro, esRutaPublica, urlLoginConDestino } from '@/lib/rutas'

/**
 * Proxy (Next 16 — reemplaza a middleware).
 *
 * Sesión: ante un access token expirado con refresh_token válido, rota los
 * tokens contra el backend y los setea en la respuesta (Set-Cookie) + reescribe
 * el header Cookie downstream para que `cookies()` en Server Components
 * vea el token nuevo en el mismo request.
 *
 * Esto corrige el bug original donde un self-fetch desde Server Components
 * descartaba el Set-Cookie y dejaba al navegador con tokens viejos/expirados.
 *
 * Redirección por sesión: /login es la única ruta pública. Con sesión activa
 * redirige al destino pedido (?next= o /) y sin sesión cualquier ruta protegida
 * redirige a /login conservando la ruta original en ?next=. Las rutas /api del
 * BFF quedan fuera por el matcher: responden 401/403 JSON, nunca un redirect.
 */
export async function proxy(request: NextRequest) {
	const esPublica = esRutaPublica(request.nextUrl.pathname)

	const token = request.cookies.get('token')?.value
	const refreshToken = request.cookies.get('refresh_token')?.value

	// Access token vigente → hay sesión, sin llamar al backend.
	if (token && !tokenExpirado(token)) {
		return esPublica ? redirigirALaApp(request) : NextResponse.next()
	}

	// Sin refresh_token no hay forma de recuperar la sesión.
	if (!refreshToken) {
		const res = esPublica ? NextResponse.next() : redirigirALogin(request)
		eliminarCookiesAuth(res, request)
		return res
	}

	// Token expirado o ausente: intentar refresh contra el backend
	console.log('[proxy] Access token expirado/ausente, intentando refresh...')
	const resultado = await refrescarTokensEnBackend(refreshToken)

	if (!resultado) {
		console.log('[proxy] Refresh falló, continuando sin sesión')
		// Limpiamos cookies inválidas para evitar bucles. En rutas protegidas
		// además redirigimos a /login; /login se muestra sin sesión.
		const res = esPublica ? NextResponse.next() : redirigirALogin(request)
		eliminarCookiesAuth(res, request)
		return res
	}

	console.log('[proxy] Refresh exitoso, seteando nuevos cookies')

	// Sesión recuperada: en una ruta pública (solo /login) no mostramos el
	// formulario, vamos al destino pedido o al home.
	if (esPublica) {
		const res = redirigirALaApp(request)
		aplicarTokens(res, resultado)
		return res
	}

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
	aplicarTokens(response, resultado)

	return response
}

/**
 * Con sesión activa, /login redirige al destino que se pidió en ?next= (si es
 * una ruta interna segura) o al home.
 */
function redirigirALaApp(request: NextRequest) {
	const destino = destinoSeguro(request.nextUrl.searchParams.get('next')) ?? '/'
	return NextResponse.redirect(new URL(destino, request.url))
}

/**
 * Sin sesión, una ruta protegida redirige a /login conservando la ruta
 * original en ?next= para volver a ella tras el login.
 */
function redirigirALogin(request: NextRequest) {
	const { pathname, search } = request.nextUrl
	return NextResponse.redirect(
		new URL(urlLoginConDestino(pathname, search), request.url),
	)
}

/** Setea las cookies de auth rotadas en la respuesta (next o redirect). */
function aplicarTokens(res: NextResponse, resultado: RefreshTokensResult) {
	res.cookies.set(
		'token',
		resultado.access_token,
		cookieOptionsToken(resultado.expire_minutes),
	)
	res.cookies.set('refresh_token', resultado.refresh_token, cookieOptionsRefresh())
}

/** Elimina las cookies de auth huérfanas, solo si el navegador las tenía. */
function eliminarCookiesAuth(res: NextResponse, request: NextRequest) {
	if (request.cookies.has('token')) {
		res.cookies.set('token', '', { ...cookieOptionsToken(0), maxAge: 0 })
	}
	if (request.cookies.has('refresh_token')) {
		res.cookies.set('refresh_token', '', {
			...cookieOptionsRefresh(),
			maxAge: 0,
		})
	}
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
		'/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.svg$).*)',
	],
}
