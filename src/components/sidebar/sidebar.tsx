'use client'

import { useSidebarStore } from '@/global_states/sidebar-store'
import Nav from './nav/nav'

const SideBar = () => {
	const { open, setOpen } = useSidebarStore()

	return (
		<>
			{open && (
				<div
					className='fixed inset-0 bg-black/50 z-40 lg:hidden'
					onClick={() => setOpen(false)}
				/>
			)}

			<aside
				className={`
					bg-secondary text-white z-50
					fixed top-0 left-0 h-full w-64
					transform transition-transform duration-300
					
					${open ? 'translate-x-0' : '-translate-x-full'}
					
					lg:translate-x-0 lg:static lg:h-auto
				`}
			>
				<div className='p-5 border-b border-border-secondary'>
					<span>Menú</span>
				</div>

				<Nav open={true} />
			</aside>
		</>
	)
}

export default SideBar
