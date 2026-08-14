'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { tituloDeRuta } from '@/lib/route-titles'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import HeaderUsuario from '../header-usuario/header-usuario'
import ToggleSidebarButton from '../toggle-sidebar-button/toggle-sidebar-button'

interface HeaderClientProps {
	nombreUsuario: string
	nombreRoles: string[]
}

const HeaderClient = ({ nombreUsuario, nombreRoles }: HeaderClientProps) => {
	const pathname = usePathname()

	const panelTitle = useMemo(() => tituloDeRuta(pathname), [pathname])

	return (
		<div className='flex h-14 items-center justify-between gap-2 px-3 sm:px-4 lg:px-6'>
			{/* Izquierda: toggle + título */}
			<div className='flex min-w-0 items-center gap-2'>
				<ToggleSidebarButton />
				<h1 className='truncate text-base font-semibold text-foreground sm:text-lg'>
					{panelTitle}
				</h1>
			</div>

			{/* Derecha: tema + usuario */}
			<div className='flex items-center gap-1.5 sm:gap-2'>
				<ThemeToggle />
				<div
					className='hidden h-6 w-px bg-border sm:block'
					aria-hidden='true'
				/>
				<HeaderUsuario nombre={nombreUsuario} nombreRoles={nombreRoles} />
			</div>
		</div>
	)
}

export default HeaderClient
