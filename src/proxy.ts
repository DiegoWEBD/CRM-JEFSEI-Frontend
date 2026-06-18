import { NextRequest, NextResponse } from 'next/server'
import { TokenPayload } from './dtos/token-payload'

type RoleProtectedRoute = {
  path: string
  roles: string[]
}

const publicRoutes: string[] = ['/login']

const roleProtectedRoutes: RoleProtectedRoute[] = [
  {
    path: '/personal',
    roles: ['GERENTE_OPERACIONES', 'GERENTE_GENERAL', 'GERENTE_COMERCIAL'],
  },
  {
    path: '/solicitudes-estudio',
    roles: [
      'EJECUTIVO_EVALUACION_PROYECTOS',
      'GERENTE_COMERCIAL',
      'GERENTE_GENERAL',
      'GERENTE_OPERACIONES',
    ],
  },
  {
    path: '/cotizaciones-estudios-emitidos',
    roles: [
      'EJECUTIVO_EVALUACION_PROYECTOS',
      'GERENTE_COMERCIAL',
      'GERENTE_GENERAL',
      'GERENTE_OPERACIONES',
    ],
  },
  {
    path: '/administradores',
    roles: [
      'EJECUTIVO_RENOVACION_CONDOMINIOS',
      'EJECUTIVO_RENOVACION_LINEAS_PERSONALES',
      'GERENTE_COMERCIAL',
      'GERENTE_GENERAL',
      'GERENTE_OPERACIONES',
    ],
  },
]

function getUserRoles(token: string): string[] {
  try {
    const payload: TokenPayload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    )
    return payload.codigo_roles ?? []
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

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const protectedRoute = getRoleProtectedRoute(pathname)

  if (protectedRoute) {
    const userRoles = getUserRoles(token)
    if (!hasRequiredRole(userRoles, protectedRoute.roles)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
