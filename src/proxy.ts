import { NextRequest, NextResponse } from 'next/server'
import { TokenPayload } from './dtos/token-payload'

type RoleProtectedRoute = {
	path: string
	roles: string[]
}

/**
 * Rutas públicas
 * No requieren autenticación
 */
const publicRoutes: string[] = ['/login']

/**
 * Rutas protegidas por roles
 */
const roleProtectedRoutes: RoleProtectedRoute[] = [
	{
		path: '/personal',
		roles: ['GERENTE_OPERACIONES', 'GERENTE_GENERAL', 'GERENTE_COMERCIAL'],
	},
]

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

function isPublicRoute(pathname: string): boolean {
	return publicRoutes.includes(pathname)
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
	 * Si el usuario autenticado entra a /login,
	 * redirigir al home
	 */
	if (pathname === '/login' && token) {
		return NextResponse.redirect(new URL('/', req.url))
	}

	/**
	 * Permitir rutas públicas
	 */
	if (isPublicRoute(pathname)) {
		return NextResponse.next()
	}

	/**
	 * Todo lo demás requiere autenticación
	 */
	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url))
	}

	/**
	 * Validación de roles
	 */
	const protectedRoute = getRoleProtectedRoute(pathname)

	if (protectedRoute) {
		const userRoles = getUserRoles(token)

		if (!hasRequiredRole(userRoles, protectedRoute.roles)) {
			return NextResponse.redirect(new URL('/no-autorizado', req.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Excluir:
		 * - api
		 * - archivos estáticos
		 * - imágenes
		 * - favicon
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}
