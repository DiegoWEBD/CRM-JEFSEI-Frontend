import { MdGroups, MdOutlineDashboard } from 'react-icons/md'
import NavElement from './nav-element'
import AuthGuard from '@/components/layouts/guards/auth-guard'

type NavProps = {
	open?: boolean
}

const Nav = ({ open }: NavProps) => {
	return (
		<nav className='mt-4 px-2'>
			<ul className='flex flex-col gap-3'>
				<NavElement
					href='/'
					icono={<MdOutlineDashboard />}
					titulo='Inicio'
					open={open}
				/>
				<AuthGuard
					codigosRoles={[
						'GERENTE_COMERCIAL, GERENTE_GENERAL, GERENTE_OPERACIONES',
					]}
				>
					<NavElement
						href='/personal'
						icono={<MdGroups />}
						titulo='Personal'
						open={open}
					/>
				</AuthGuard>

				<AuthGuard>
					<NavElement
						href='/prospectos'
						icono={<MdGroups />}
						titulo='Prospectos'
						open={open}
					/>
				</AuthGuard>
			</ul>
		</nav>
	)
}

export default Nav
