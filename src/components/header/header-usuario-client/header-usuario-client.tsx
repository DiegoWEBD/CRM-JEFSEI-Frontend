'use client'

import InicialesUsuario from '@/app/personal/components/iniciales-usuario'
import { useAuth } from '@/hooks/auth/use-auth'
import { useEffect, useRef, useState } from 'react'

type Props = {
	nombre: string
	roles: string[]
}

const HeaderUsuarioClient = ({ nombre, roles }: Props) => {
	const { logout } = useAuth()

	const [menuAbierto, setMenuAbierto] = useState(false)

	const contenedorRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const manejarClickFuera = (event: MouseEvent) => {
			if (!contenedorRef.current) return

			if (!contenedorRef.current.contains(event.target as Node)) {
				setMenuAbierto(false)
			}
		}

		document.addEventListener('mousedown', manejarClickFuera)

		return () => {
			document.removeEventListener('mousedown', manejarClickFuera)
		}
	}, [])

	const nombreArray = nombre.split(' ').slice(0, 2)

	return (
		<div ref={contenedorRef} className='relative'>
			<button
				type='button'
				onClick={() => setMenuAbierto(actual => !actual)}
				className='text-sm flex gap-2 items-center py-1 px-4 rounded-xl hover:bg-slate-100 transition-all border border-border-primary hover:cursor-pointer'
			>
				<InicialesUsuario nombre={nombre} primary />

				<div className='text-left'>
					<p className='font-semibold'>{nombreArray.join(' ')}</p>

					<p className='text-subtitle'>
						{roles.map(rol => (
							<span key={rol}>{rol}</span>
						))}
					</p>
				</div>
			</button>

			{menuAbierto && (
				<div className='absolute right-0 mt-2 min-w-44 rounded-xl border border-border-primary bg-white shadow-lg p-1 z-20'>
					<button
						type='button'
						onClick={() => {
							setMenuAbierto(false)
							logout()
						}}
						className='w-full text-left px-3 py-2 rounded-lg text-danger hover:bg-red-50 hover:cursor-pointer'
					>
						Cerrar sesión
					</button>
				</div>
			)}
		</div>
	)
}

export default HeaderUsuarioClient
