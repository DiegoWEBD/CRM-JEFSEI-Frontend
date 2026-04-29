import LogoutButton from '../botones/logout-button'
import Input from '../forms/input/input'

const Header = () => (
	<header className='h-16 bg-white shadow flex items-center justify-between px-4'>
		<div>
			<Input
				className='bg-gray-100'
				placeholder='Buscar clientes, pólizas...'
			/>
		</div>
		<LogoutButton />
	</header>
)

export default Header
