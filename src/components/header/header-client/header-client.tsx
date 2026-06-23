'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import HeaderUsuario from '../header-usuario/header-usuario'
import ToggleSidebarButton from '../toggle-sidebar-button/toggle-sidebar-button'

const ROUTE_TITLES: Record<string, string> = {
	'/': 'Inicio',
	'/dashboard': 'Dashboard',
	'/oportunidades': 'Oportunidades',
	'/prospectos': 'Prospectos',
	'/solicitudes-estudio': 'Solicitudes de Estudio',
	'/cotizaciones-estudios-emitidos': 'Cotizaciones / Estudios Emitidos',
	'/personal': 'Personal',
	'/administradores': 'Administradores',
}

interface HeaderClientProps {
	nombreUsuario: string
	nombreRoles: string[]
	codigoRoles: string[]
}

const HeaderClient = ({ nombreUsuario, nombreRoles }: HeaderClientProps) => {
	const pathname = usePathname()

	const panelTitle = useMemo(() => {
		const sorted = Object.keys(ROUTE_TITLES).sort((a, b) => b.length - a.length)
		for (const route of sorted) {
			if (pathname.startsWith(route)) return ROUTE_TITLES[route]
		}
		return 'JEFSEI'
	}, [pathname])

	const today = new Date()
	const formattedDate = today.toLocaleDateString('es-ES', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	return (
		<>
			<div className='flex flex-wrap items-start justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4 lg:px-6'>
				<div className='flex items-center gap-3'>
					<ToggleSidebarButton />
					<div className='min-w-0'>
						<div className='flex items-center gap-3'>
							<div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
								<span className='text-primary-foreground font-bold text-sm'>
									IB
								</span>
							</div>
							<div className='min-w-0'>
								<h1 className='text-base font-semibold text-foreground sm:text-lg'>
									{panelTitle}
								</h1>
								<p className='line-clamp-1 text-[11px] text-muted-foreground sm:text-xs'>
									{formattedDate}
								</p>
							</div>
						</div>
					</div>
				</div>

				<HeaderUsuario nombre={nombreUsuario} nombreRoles={nombreRoles} />
			</div>
		</>
	)
}

export default HeaderClient
