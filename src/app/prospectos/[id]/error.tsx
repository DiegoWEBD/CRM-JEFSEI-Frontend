'use client'

import Link from 'next/link'
import { Button } from '@/components/button'

export default function ProspectoError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-4'>
      <h1 className='text-6xl font-bold text-muted-foreground'>Error</h1>
      <p className='text-lg text-muted-foreground'>Ocurrió un error al cargar este prospecto.</p>
      <div className='flex gap-2'>
        <Button variant='outline' size='sm' onClick={reset}>
          Reintentar
        </Button>
        <Button variant='outline' size='sm' asChild>
          <Link href='/prospectos'>Volver a prospectos</Link>
        </Button>
      </div>
    </div>
  )
}
