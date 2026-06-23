'use client'

import { useEffect } from 'react'
import { useUserSession } from '@/hooks/auth/use-user-session'

type SessionWatcherProps = {
  autenticado: boolean
}

export default function SessionWatcher({ autenticado }: SessionWatcherProps) {
  const { usuario, cargando } = useUserSession()

  useEffect(() => {
    if (!cargando && !usuario && autenticado) {
      window.location.href = '/login'
    }
  }, [cargando, usuario, autenticado])

  return null
}
