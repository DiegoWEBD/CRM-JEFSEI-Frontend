import HeaderUsuario from '../header-usuario/header-usuario'
import ToggleSidebarButton from '../toggle-sidebar-button/toggle-sidebar-button'

interface HeaderClientProps {
	nombreUsuario: string
	rolPrincipal: string
}

const HeaderClient = ({ nombreUsuario, rolPrincipal }: HeaderClientProps) => {
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
									{rolPrincipal}
								</h1>
								<p className='line-clamp-1 text-[11px] text-muted-foreground sm:text-xs'>
									{formattedDate}
								</p>
							</div>
						</div>
					</div>
				</div>

				<HeaderUsuario nombre={nombreUsuario} />
			</div>
		</>
	)
}

export default HeaderClient
