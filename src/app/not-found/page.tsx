'use client'

import Link from 'next/link'
import { Button } from '@/components/button'

export default function NotFoundPage() {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-4'>
      <h1 className='text-6xl font-bold text-muted-foreground'>404</h1>
      <p className='text-lg text-muted-foreground'>Página no encontrada</p>
      <Button asChild variant='outline' size='sm'>
        <Link href='/'>Ir al inicio</Link>
      </Button>
    </div>
  )
}
