import { FiShield } from 'react-icons/fi'

const LoginFormHeader = () => {
	return (
		<div className='mb-6 flex flex-col items-center'>
			<div className='bg-blue-100 h-12 w-12 flex items-center justify-center rounded-full mb-5'>
				<FiShield size='1.5rem' />
			</div>
			<h1 className='text-xl font-bold'>JEFSEI Operaciones</h1>
			<p className='text-subtitle'>Inicia sesión para continuar</p>
		</div>
	)
}

export default LoginFormHeader
