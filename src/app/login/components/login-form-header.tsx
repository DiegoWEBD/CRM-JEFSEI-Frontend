import { CardHeader } from '@/components/card'
import { Shield } from 'lucide-react'

const LoginFormHeader = () => {
	return (
		<CardHeader className='mb-6 justify-items-center'>
			<div className='bg-blue-100 h-12 w-12 flex items-center justify-center rounded-full mb-5'>
				<Shield size='1.5rem' />
			</div>
			<h1 className='text-xl font-bold'>CRM JEFSEI</h1>
			<p className='text-subtitle'>Inicia sesión para continuar</p>
		</CardHeader>
	)
}

export default LoginFormHeader
