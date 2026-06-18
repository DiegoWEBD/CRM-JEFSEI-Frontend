'use client'

import { useUserSession } from '@/hooks/auth/use-user-session'
import { ReactNode } from 'react'

type AuthGuardProps = {
  children: ReactNode
  /** Solo se renderiza si el usuario tiene al menos uno de estos roles */
  allowedRoles?: string[]
  /** Contenido alternativo cuando no está autorizado (default: null) */
  fallback?: ReactNode
  /** Contenido alternativo mientras se verifica auth (default: null) */
  loadingFallback?: ReactNode
}

export default function AuthGuard({
  children,
  allowedRoles = [],
  fallback = null,
  loadingFallback = null,
}: AuthGuardProps) {
  const { usuario, cargando, tieneAlgunRol } = useUserSession()

  if (cargando) return <>{loadingFallback}</>
  if (!usuario) return <>{fallback}</>
  if (allowedRoles.length > 0 && !tieneAlgunRol(allowedRoles)) return <>{fallback}</>

  return <>{children}</>
}
