'use client'

import Link from 'next/link'
import { Button } from '@/components/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-4'>
      <h1 className='text-6xl font-bold text-muted-foreground'>Error</h1>
      <p className='text-lg text-muted-foreground'>Ha ocurrido un error inesperado.</p>
      <div className='flex gap-2'>
        <Button variant='outline' size='sm' onClick={reset}>
          Reintentar
        </Button>
        <Button variant='outline' size='sm' asChild>
          <Link href='/'>Ir al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
