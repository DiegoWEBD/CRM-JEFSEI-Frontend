'use client'

import { FaBars } from 'react-icons/fa6'
import { useSidebarStore } from '@/global_states/sidebar-store'
import HeaderUsuario from './header-usuario/header-usuario'

const Header = () => {
	const { toggle } = useSidebarStore()

	return (
		<header className='h-16 bg-white flex items-center justify-between lg:justify-end px-4 shadow z-10'>
			<button
				onClick={toggle}
				className='lg:hidden p-2 rounded hover:bg-gray-100'
			>
				<FaBars />
			</button>

			<HeaderUsuario />
		</header>
	)
}

export default Header
