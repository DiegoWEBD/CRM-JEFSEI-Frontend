'use client'

import Link from 'next/link'
import { Button } from '@/components/button'
import { ShieldAlert } from 'lucide-react'

type ErrorFallbackProps = {
	error: Error & { digest?: string }
	reset: () => void
}

export default function ErrorFallback({ error, reset }: ErrorFallbackProps) {
	const isUnauthorized = error.name === 'UnauthorizedError'

	if (isUnauthorized) {
		return (
			<div className='flex h-full flex-col items-center justify-center gap-4'>
				<div className='flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
					<ShieldAlert className='h-6 w-6 text-muted-foreground' aria-hidden />
				</div>
				<h1 className='text-lg font-semibold text-foreground'>Sin acceso</h1>
				<p className='text-sm text-muted-foreground'>
					No tienes permiso para acceder a este recurso. Contacta al administrador si
					crees que es un error.
				</p>
				<Button variant='outline' size='sm' asChild>
					<Link href='/'>Volver al inicio</Link>
				</Button>
			</div>
		)
	}

	return (
		<div className='flex h-full flex-col items-center justify-center gap-4'>
			<h1 className='text-6xl font-bold text-muted-foreground'>Error</h1>
			<p className='text-lg text-muted-foreground'>Ocurrió un error al cargar este recurso.</p>
			<div className='flex gap-2'>
				<Button variant='outline' size='sm' onClick={reset}>
					Reintentar
				</Button>
				<Button variant='outline' size='sm' asChild>
					<Link href='/'>Volver al inicio</Link>
				</Button>
			</div>
		</div>
	)
}
