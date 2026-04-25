'use client'

import Boton from '@/components/botones/boton'
import Form from '@/components/forms/form/form'
import Input from '@/components/forms/input/input'
import { useAuth } from '@/hooks/auth/use-auth'
import { useFormik } from 'formik'
import { FiShield } from 'react-icons/fi'

const LoginForm = () => {
	const { cargando, error, login } = useAuth()
	const formik = useFormik({
		initialValues: {
			rut: '',
			password: '',
		},
		onSubmit: values => login(values.rut, values.password),
	})

	if (cargando) {
		return <p>Cargando...</p>
	}

	if (error) {
		return <p>{error}</p>
	}

	return (
		<Form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
			<div className='mb-6 flex flex-col items-center'>
				<div className='bg-blue-100 h-12 w-12 flex items-center justify-center rounded-full mb-5'>
					<FiShield size='1.5rem' />
				</div>
				<h1 className='text-xl font-bold'>JEFSEI Operaciones</h1>
				<p className='text-subtitle'>Inicia sesión para continuar</p>
			</div>
			<Input
				name='rut'
				label='Rut'
				onChange={formik.handleChange}
				value={formik.values.rut}
			/>
			<Input
				name='password'
				label='Contraseña'
				type='password'
				onChange={formik.handleChange}
				value={formik.values.password}
			/>

			<Boton type='submit'>Iniciar Sesión</Boton>
		</Form>
	)
}

export default LoginForm
