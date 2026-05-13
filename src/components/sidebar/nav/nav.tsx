import { MdGroups, MdOutlineDashboard } from 'react-icons/md'
import NavElement from './nav-element'
import { getSession } from '@/lib/auth'

type NavProps = {
	open?: boolean
}

const Nav = async ({ open }: NavProps) => {
	const usuario = await getSession()

	const tieneRolPersonal =
		usuario?.roles.some(rol =>
			['GERENTE_COMERCIAL', 'GERENTE_GENERAL', 'GERENTE_OPERACIONES'].includes(
				rol,
			),
		) ?? false

	return (
		<nav className='mt-4 px-2'>
			<ul className='flex flex-col gap-3'>
				<NavElement
					href='/'
					icono={<MdOutlineDashboard />}
					titulo='Inicio'
					open={open}
				/>

				{tieneRolPersonal && (
					<NavElement
						href='/personal'
						icono={<MdGroups />}
						titulo='Personal'
						open={open}
					/>
				)}

				{usuario && (
					<NavElement
						href='/prospectos'
						icono={<MdGroups />}
						titulo='Prospectos'
						open={open}
					/>
				)}
			</ul>
		</nav>
	)
}

export default Nav
