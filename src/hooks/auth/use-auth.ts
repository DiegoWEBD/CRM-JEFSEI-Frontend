'use client'

import { clientAxios } from '@/infraestructura/axios/client-axios'
import { destinoSeguro } from '@/lib/rutas'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUserSession } from './use-user-session'

export const useAuth = () => {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const session = useUserSession()
  const queryClient = useQueryClient()

  const login = async (rut: string, password: string) => {
    try {
      setCargando(true)
      setError(null)

      await clientAxios.post('/api/auth/login', {
        rut,
        password,
      })

      queryClient.clear()
      // Vuelve a la ruta que se intentaba visitar (?next=) o al home.
      const next = new URLSearchParams(window.location.search).get('next')
      router.replace(destinoSeguro(next) ?? '/')
      router.refresh()
    } catch {
      setError('Credenciales inválidas')
    } finally {
      setCargando(false)
    }
  }

  const logout = async () => {
    try {
      setCargando(true)
      setError(null)

      await clientAxios.post('/api/auth/logout')
      queryClient.clear()
      router.replace('/login')
      router.refresh()
    } catch {
      console.error('Error al cerrar sesión')
    } finally {
      setCargando(false)
    }
  }

  return {
    cargando: cargando || session.cargando,
    error,
    login,
    logout,
    usuario: session.usuario,
    tieneRol: session.tieneRol,
    tieneAlgunRol: session.tieneAlgunRol,
  }
}
