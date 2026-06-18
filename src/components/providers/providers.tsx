'use client'

import { QueryCache, MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { Toaster } from '@/components/sonner'
import axios from 'axios'
import { toast } from 'sonner'

function notificarError(error: Error) {
  if (axios.isAxiosError(error)) {
    toast.error(
      error.response?.data?.error
        || error.response?.data?.detail
        || 'Ha ocurrido un error inesperado',
    )
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
