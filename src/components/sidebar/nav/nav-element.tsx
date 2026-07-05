'use client'

import { useSidebarStore } from '@/global_states/sidebar-store'
import { classname } from '@/lib/class-name'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

type NavElementProps = {
	href: string
	icono: ReactNode
	titulo: string
	open?: boolean
}

const NavElement = ({ href, icono, titulo, open }: NavElementProps) => {
	const pathname = usePathname()

	const { setOpen } = useSidebarStore()

	const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

	return (
		<Link
			href={href}
			onClick={() => setOpen(false)}
			className={classname(
				'text-muted-foreground group flex h-11 w-full items-center gap-3 overflow-hidden rounded-md px-3 text-sm transition-all outline-hidden select-none',
				isActive
					? 'bg-sidebar-primary/15 text-sidebar-primary font-medium'
					: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
			)}
		>
			<span
				className={classname(
					'flex size-4 shrink-0 items-center justify-center',
				)}
			>
				{icono}
			</span>

			{open && (
				<span className='min-w-0 wrap-break-words whitespace-normal'>
					{titulo}
				</span>
			)}
		</Link>
	)
}

export default NavElement
