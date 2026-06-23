'use client'

import { obtenerSesion } from '@/aplicacion/auth/use-cases/obtener-sesion'
import { TokenPayload } from '@/dtos/token-payload'
import { useCallback, useEffect, useState } from 'react'

export function useUserSession() {
  const [usuario, setUsuario] = useState<TokenPayload | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    function fetch() {
      setCargando(true)
      obtenerSesion()
        .then(payload => setUsuario(payload))
        .catch(() => setUsuario(null))
        .finally(() => setCargando(false))
    }

    fetch()

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        obtenerSesion()
          .then(payload => setUsuario(payload))
          .catch(() => setUsuario(null))
      }
    }

    function onFocus() {
      obtenerSesion()
        .then(payload => setUsuario(payload))
        .catch(() => setUsuario(null))
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', onFocus)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  const tieneRol = useCallback(
    (rol: string) => usuario?.codigo_roles.includes(rol) ?? false,
    [usuario],
  )

  const tieneAlgunRol = useCallback(
    (roles: string[]) => roles.some(r => usuario?.codigo_roles.includes(r) ?? false),
    [usuario],
  )

  return { usuario, cargando, tieneRol, tieneAlgunRol }
}
