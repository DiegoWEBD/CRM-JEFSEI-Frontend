'use client'

import { QueryCache, MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { Toaster } from '@/components/sonner'
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
  return String(data)
}

function notificarError(error: Error) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    const mensaje = Array.isArray(detail)
      ? extraerMensaje(detail)
      : error.response?.data?.error || detail || 'Ha ocurrido un error inesperado'
    toast.error(mensaje)
  } else {
    toast.error(error.message || 'Ha ocurrido un error inesperado')
  }
}

type ProvidersProps = {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
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
      {children}
      <Toaster />
    </QueryClientProvider>
  )
}
