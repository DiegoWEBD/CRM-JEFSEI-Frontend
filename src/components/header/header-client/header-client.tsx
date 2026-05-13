'use client'

import { FaBars } from 'react-icons/fa6'
import { useSidebarStore } from '@/global_states/sidebar-store'

const HeaderClient = () => {
	const { toggle } = useSidebarStore()

	return (
		<button
			onClick={toggle}
			className='lg:hidden p-2 rounded hover:bg-gray-100'
		>
			<FaBars />
		</button>
	)
}

export default HeaderClient
