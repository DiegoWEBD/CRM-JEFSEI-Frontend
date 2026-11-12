'use client'

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from '@/components/sidebar'
import Nav from '../nav/nav'

type Props = {
	roles: string[]
}

const AppSidebarClient = ({ roles }: Props) => {
	const { state, toggleSidebar } = useSidebar()
	const expandida = state === 'expanded'

	return (
		<Sidebar collapsible='icon'>
			{/* Branding */}
			<SidebarHeader>
				<div className='flex items-center gap-2.5'>
					<div
						className='grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground font-semibold tracking-tight shadow-sm'
						aria-hidden='true'
					>
						<span className='text-sm leading-none'>IB</span>
					</div>
					<div className='min-w-0 group-data-[collapsible=icon]:hidden'>
						<p className='truncate text-sm font-semibold leading-none text-sidebar-foreground'>
							CRM JEFSEI
						</p>
						<p className='mt-1 truncate text-sm leading-none text-muted-foreground'>
							Corredora de Seguros
						</p>
					</div>
				</div>
			</SidebarHeader>

			{/* Navegación */}
			<SidebarContent>
				<Nav roles={roles} />
			</SidebarContent>

			{/* Footer: colapsar/expandir (sólo desktop; en móvil abre/cierra el drawer) */}
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							type='button'
							onClick={toggleSidebar}
							tooltip={expandida ? 'Contraer menú' : 'Expandir menú'}
							className='text-muted-foreground hover:text-sidebar-accent-foreground'
						>
							{expandida ? (
								<PanelLeftClose className='size-4 shrink-0' />
							) : (
								<PanelLeftOpen className='size-4 shrink-0' />
							)}
							<span className='group-data-[collapsible=icon]:hidden'>
								{expandida ? 'Contraer' : 'Expandir'}
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	)
}

export default AppSidebarClient
