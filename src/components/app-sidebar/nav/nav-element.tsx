'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import {
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/sidebar'

type NavElementProps = {
	href: string
	icono: ReactNode
	titulo: string
}

const NavElement = ({ href, icono, titulo }: NavElementProps) => {
	const pathname = usePathname()
	const { setOpenMobile } = useSidebar()

	const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={isActive} tooltip={titulo}>
				<Link
					href={href}
					onClick={() => setOpenMobile(false)}
					aria-current={isActive ? 'page' : undefined}
				>
					{icono}
					<span>{titulo}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

export default NavElement
