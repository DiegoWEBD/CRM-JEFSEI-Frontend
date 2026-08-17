'use client'

import { useEffect } from 'react'
import { useSidebarStore } from '@/global_states/sidebar-store'
import { classname } from '@/lib/class-name'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import Nav from '../nav/nav'

type Props = {
	roles: string[]
}

const SideBarClient = ({ roles }: Props) => {
	const { open, setOpen, mode, toggleMode } = useSidebarStore()

	/** Rehidrata el modo persistido sólo en cliente para evitar mismatch SSR. */
	useEffect(() => {
		void useSidebarStore.persist.rehydrate()
		setOpen(false)
	}, [setOpen])

	const displayMode = open ? 'expanded' : mode

	return (
		<>
			{/* Overlay móvil */}
			{open && (
				<div
					className='fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden'
					onClick={() => setOpen(false)}
					aria-hidden='true'
				/>
			)}

			<aside
				data-mode={displayMode}
				className={classname(
					'group/sidebar z-40 flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border/60 shadow-sm',
					'transition-[width,transform] duration-300 ease-out',
					'fixed top-0 left-0 h-full w-64',
					'data-[mode=collapsed]:w-16',
					open ? 'translate-x-0' : '-translate-x-full',
					'lg:static lg:h-auto lg:translate-x-0',
				)}
			>
				{/* Branding */}
				<div className='flex h-14 shrink-0 items-center gap-2.5 border-b border-sidebar-border/60 px-3.5'>
					<div
						className='grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground font-semibold tracking-tight shadow-sm'
						aria-hidden='true'
					>
						<span className='group-data-[mode=expanded]/sidebar:text-sm text-base leading-none'>
							IB
						</span>
					</div>
					<div className='min-w-0 group-data-[mode=collapsed]/sidebar:hidden'>
						<p className='truncate text-sm font-semibold leading-none text-sidebar-foreground'>
							CRM JEFSEI
						</p>
						<p className='mt-1 truncate text-sm leading-none text-muted-foreground'>
							Corredora de Seguros
						</p>
					</div>
				</div>

				{/* Navegación */}
				<div className='flex-1 overflow-y-auto overflow-x-hidden py-3'>
					<Nav roles={roles} />
				</div>

				{/* Footer: colapsar sidebar (sólo desktop) */}
				<div className='hidden shrink-0 border-t border-sidebar-border/60 p-2 lg:block'>
					<button
						type='button'
						onClick={toggleMode}
						className={classname(
							'flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors',
							'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
							'group-data-[mode=collapsed]/sidebar:justify-center group-data-[mode=collapsed]/sidebar:px-0',
						)}
						title={mode === 'expanded' ? 'Contraer menú' : 'Expandir menú'}
						aria-label={mode === 'expanded' ? 'Contraer menú' : 'Expandir menú'}
					>
						{mode === 'expanded' ? (
							<PanelLeftClose className='size-4 shrink-0' />
						) : (
							<PanelLeftOpen className='size-4 shrink-0' />
						)}
						<span className='group-data-[mode=collapsed]/sidebar:hidden'>
							Contraer
						</span>
					</button>
				</div>
			</aside>
		</>
	)
}

export default SideBarClient
