import HeaderClient from './header-client/header-client'
import HeaderUsuarioServer from './header-usuario-server/header-usuario-server'

const Header = () => {
	return (
		<header className='h-16 bg-white flex items-center justify-between lg:justify-end px-4 shadow z-10'>
			<HeaderClient />

			<HeaderUsuarioServer />
		</header>
	)
}

export default Header
