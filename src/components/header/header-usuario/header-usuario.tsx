'use client'

import InicialesUsuario from '@/app/personal/components/iniciales-usuario'
import { useAuthStore } from '@/global_states/auth_store'

const HeaderUsuario = () => {
	const { usuario } = useAuthStore()

	if (!usuario) return null

	const nombreArray = usuario.nombre.split(' ').slice(0, 2)

	return (
		<div className='flex gap-2 items-center py-1 px-4 rounded-xl hover:bg-slate-100 transition-all'>
			<InicialesUsuario nombre={usuario.nombre} primary />
			<div>
				<p className='font-semibold'>{nombreArray.join(' ')}</p>
				<p className='text-subtitle'>
					{usuario.roles.map(rol => (
						<span key={rol}>{rol}</span>
					))}
				</p>
			</div>
		</div>
	)
}

export default HeaderUsuario
