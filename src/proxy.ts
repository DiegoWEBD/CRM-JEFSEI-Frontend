import { NextRequest, NextResponse } from 'next/server'
import { TokenPayload } from './dtos/token-payload'

type RoleProtectedRoute = {
	path: string
	roles: string[]
}

const authRequiredRoutes: string[] = ['/', '/personal']

const roleProtectedRoutes: RoleProtectedRoute[] = [
	{
		path: '/personal',
		roles: ['GERENTE_OPERACIONES', 'GERENTE_GENERAL'],
	},
]

/**
 * Rutas públicas que no deberían ser accesibles
 * si el usuario ya está autenticado
 */
const guestOnlyRoutes: string[] = ['/login']

function getUserRoles(token: string): string[] {
	try {
		const payload: TokenPayload = JSON.parse(
			Buffer.from(token.split('.')[1], 'base64').toString(),
		)

		return payload.roles ?? []
	} catch {
		return []
	}
}

function requiresAuthentication(pathname: string): boolean {
	return authRequiredRoutes.some(route => {
		if (route === '/') {
			return pathname === '/'
		}

		return pathname.startsWith(route)
	})
}

function isGuestOnlyRoute(pathname: string): boolean {
	return guestOnlyRoutes.includes(pathname)
}

function getRoleProtectedRoute(
	pathname: string,
): RoleProtectedRoute | undefined {
	return roleProtectedRoutes.find(route => pathname.startsWith(route.path))
}

function hasRequiredRole(
	userRoles: string[],
	requiredRoles: string[],
): boolean {
	return userRoles.some(role => requiredRoles.includes(role))
}

export function proxy(req: NextRequest) {
	const token = req.cookies.get('token')?.value
	const pathname = req.nextUrl.pathname

	/**
	 * Si el usuario ya está autenticado y entra a /login,
	 * redirigir al home
	 */
	if (isGuestOnlyRoute(pathname) && token) {
		return NextResponse.redirect(new URL('/', req.url))
	}

	/**
	 * Si la ruta no requiere autenticación, dejar pasar
	 */
	if (!requiresAuthentication(pathname)) {
		return NextResponse.next()
	}

	/**
	 * Si requiere autenticación pero no hay token,
	 * redirigir a login
	 */
	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url))
	}

	/**
	 * Validar autorización por roles si aplica
	 */
	const protectedRoute = getRoleProtectedRoute(pathname)

	if (protectedRoute) {
		const userRoles = getUserRoles(token)

		if (!hasRequiredRole(userRoles, protectedRoute.roles)) {
			return NextResponse.redirect(new URL('/unauthorized', req.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/', '/login', '/personal/:path*'],
}
