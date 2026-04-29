'use client'

import Boton from '@/components/botones/button'
import Form from '@/components/forms/form/form'
import Input from '@/components/forms/input/input'
import { useAuth } from '@/hooks/auth/use-auth'
import { useFormik } from 'formik'
import LoginFormHeader from './login-form-header'
import FormError from '@/components/forms/form-error/form-error'
import Loader from '@/components/loaders/loder'

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
		return <Loader />
	}

	return (
		<Form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
			<LoginFormHeader />
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
			{error && <FormError>{error}</FormError>}
			<Boton type='submit'>Iniciar Sesión</Boton>
		</Form>
	)
}

export default LoginForm
