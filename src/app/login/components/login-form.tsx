'use client'

import Button from '@/components/button/button'
import Form from '@/components/forms/form/form'
import Input from '@/components/forms/input/input'
import { useAuth } from '@/hooks/auth/use-auth'
import { useFormik } from 'formik'
import LoginFormHeader from './login-form-header'
import FormError from '@/components/forms/form-error/form-error'
import Loader from '@/components/loaders/loder'
import Card from '@/components/card/card'
import CardContent from '@/components/card/card-content/card-content'
import CardFooter from '@/components/card/card-footer/card-footer'
import Label from '@/components/forms/label/label'

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
		<Card className='w-110'>
			<Form onSubmit={formik.handleSubmit}>
				<LoginFormHeader />
				<CardContent className='space-y-3'>
					<Label>Rut</Label>
					<Input
						name='rut'
						onChange={formik.handleChange}
						value={formik.values.rut}
					/>
					<Label>Contraseña</Label>
					<Input
						name='password'
						type='password'
						onChange={formik.handleChange}
						value={formik.values.password}
					/>
					{error && <FormError>{error}</FormError>}
				</CardContent>
				<CardFooter>
					<Button type='submit' className='w-full'>
						Iniciar Sesión
					</Button>
				</CardFooter>
			</Form>
		</Card>
	)
}

export default LoginForm
