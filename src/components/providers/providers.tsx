'use client'

import { QueryCache, MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/sonner'
import { AuthProvider } from '@/contexts/auth-context'
import type { TokenPayload } from '@/dtos/token-payload'
import axios from 'axios'
import { toast } from 'sonner'

function extraerMensaje(data: unknown): string {
  if (typeof data === 'string') return data
  if (Array.isArray(data)) {
    return data.map((d: unknown) => {
      if (d && typeof d === 'object' && 'msg' in d) return String((d as Record<string, unknown>).msg)
      return String(d)
    }).join(', ')
  }
  if (data && typeof data === 'object' && 'msg' in data) {
    return String((data as Record<string, unknown>).msg)
  }
  return String(data)
}

function notificarError(error: Error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return
    const detail = error.response?.data?.detail
    const mensaje = detail
      ? extraerMensaje(detail)
      : error.response?.data?.error || 'Ha ocurrido un error inesperado'
    toast.error(mensaje)
  } else {
    toast.error(error.message || 'Ha ocurrido un error inesperado')
  }
}

type ProvidersProps = {
  children: ReactNode
  initialPayload: TokenPayload | null
}

export default function Providers({ children, initialPayload }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: notificarError,
        }),
        mutationCache: new MutationCache({
          onError: notificarError,
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
        <AuthProvider key={initialPayload?.rut ?? 'anonymous'} initialPayload={initialPayload}>
          {children}
        </AuthProvider>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  )
}
