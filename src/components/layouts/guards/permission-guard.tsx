'use client'

import { useUserSession } from '@/hooks/auth/use-user-session'
import { ReactNode } from 'react'

type PermissionGuardProps = {
	children: ReactNode
	/** Solo se renderiza si el usuario tiene al menos uno de estos permisos (OR) */
	allowedPermissions: string[]
	/** Contenido alternativo cuando no está autorizado (default: null) */
	fallback?: ReactNode
	/** Contenido alternativo mientras se verifica auth (default: null) */
	loadingFallback?: ReactNode
	/** Si es true, requiere TODOS los permisos (AND). Default: false (OR) */
	requireAll?: boolean
}

export default function PermissionGuard({
	children,
	allowedPermissions,
	fallback = null,
	loadingFallback = null,
	requireAll = false,
}: PermissionGuardProps) {
	const { usuario, cargando, tieneAlgunPermiso, tieneTodosLosPermisos } =
		useUserSession()

	if (cargando) return <>{loadingFallback}</>
	if (!usuario) return <>{fallback}</>
	if (allowedPermissions.length > 0) {
		const hasPermission = requireAll
			? tieneTodosLosPermisos(allowedPermissions)
			: tieneAlgunPermiso(allowedPermissions)
		if (!hasPermission) return <>{fallback}</>
	}

	return <>{children}</>
}
