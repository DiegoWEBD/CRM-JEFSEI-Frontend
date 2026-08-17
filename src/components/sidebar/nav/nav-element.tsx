'use client'

import { useSidebarStore } from '@/global_states/sidebar-store'
import { useIsMobile } from '@/components/use-mobile/use-mobile'
import { classname } from '@/lib/class-name'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

type NavElementProps = {
	href: string
	icono: ReactNode
	titulo: string
}

const NavElement = ({ href, icono, titulo }: NavElementProps) => {
	const pathname = usePathname()
	const { setOpen } = useSidebarStore()
	const isMobile = useIsMobile()
	const mode = useSidebarStore(s => s.mode)

	const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

	/** Modo mini-rail desktop: mostrar tooltip con etiqueta. */
	const collapsed = mode === 'collapsed' && !isMobile

	const link = (
		<Link
			href={href}
			onClick={() => setOpen(false)}
			aria-current={isActive ? 'page' : undefined}
			title={collapsed ? titulo : undefined}
			className={classname(
				'relative flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors duration-150 outline-none select-none',
				'group-data-[mode=collapsed]/sidebar:justify-center group-data-[mode=collapsed]/sidebar:px-0',
				isActive
					? 'bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:h-4 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-primary'
					: 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
			)}
		>
			<span className='grid size-4 shrink-0 place-items-center text-current'>
				{icono}
			</span>
			<span className='min-w-0 truncate group-data-[mode=collapsed]/sidebar:hidden'>
				{titulo}
			</span>
		</Link>
	)

	if (collapsed) {
		return (
			<Tooltip delayDuration={200}>
				<TooltipTrigger asChild>{link}</TooltipTrigger>
				<TooltipContent side='right' sideOffset={8} className='text-xs'>
					{titulo}
				</TooltipContent>
			</Tooltip>
		)
	}

	return link
}

export default NavElement