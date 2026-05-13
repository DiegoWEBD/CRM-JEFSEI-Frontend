import { MdGroups, MdOutlineDashboard } from 'react-icons/md'
import NavElement from './nav-element'
import { getSession } from '@/lib/auth'

type NavProps = {
	open?: boolean
}

const Nav = async ({ open }: NavProps) => {
	const session = await getSession()

	const tieneRolPersonal =
		session?.codigo_roles.some(codigo =>
			['GERENTE_COMERCIAL', 'GERENTE_GENERAL', 'GERENTE_OPERACIONES'].includes(
				codigo,
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

				{session && (
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
