'use client'

import { ReactNode } from 'react'
import { useSidebarStore } from '@/global_states/sidebar-store'
import { classname } from '@/lib/class-name'

type Props = {
	children: ReactNode
}

const SideBarClient = ({ children }: Props) => {
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
				className={classname(
					'bg-sidebar text-sidebar-foreground z-40 border-r border-border/60 fixed top-0 left-0 h-full w-64 shadow-sm transform transition-transform duration-300',
					open ? 'translate-x-0' : '-translate-x-full',
					'lg:translate-x-0 lg:static lg:h-auto',
				)}
			>
				<div className='p-5 border-b border-border'>
					<span>Menú</span>
				</div>

				{children}
			</aside>
		</>
	)
}

export default SideBarClient
