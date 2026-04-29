import { MdGroups, MdOutlineDashboard } from 'react-icons/md'
import NavElement from './nav-element'

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
				<NavElement
					href='/personal'
					icono={<MdGroups />}
					titulo='Personal'
					open={open}
				/>
			</ul>
		</nav>
	)
}

export default Nav
