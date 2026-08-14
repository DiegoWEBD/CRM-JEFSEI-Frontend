'use client'

import { Button } from '@/components/button'
import Form from '@/components/forms/form/form'
import Input from '@/components/forms/input/input'
import { useAuth } from '@/hooks/auth/use-auth'
import { useFormik } from 'formik'
import LoginFormHeader from './login-form-header'
import FormError from '@/components/forms/form-error/form-error'
import { Card, CardContent, CardFooter } from '@/components/card'
import Label from '@/components/forms/label/label'
import { formatRut } from '@/utils/format-rut'
import { Eye, EyeOff, Loader2, User, Lock, AlertCircle } from 'lucide-react'
import { useId, useState } from 'react'

const LoginForm = () => {
	const { cargando, error, login } = useAuth()
	const [showPassword, setShowPassword] = useState(false)
	const rutId = useId()
	const passId = useId()

	const formik = useFormik({
		initialValues: {
			rut: '',
			password: '',
		},
		onSubmit: values => {
			const rutLimpio = values.rut.replace(/[^0-9kK]/g, '').toUpperCase()
			login(rutLimpio, values.password)
		},
	})

	return (
		<Card className='w-full max-w-sm shadow-sm'>
			<Form onSubmit={formik.handleSubmit}>
				<LoginFormHeader />
				<CardContent className='space-y-4 pt-5'>
					<div className='space-y-1.5'>
						<Label htmlFor={rutId}>RUT</Label>
						<div className='relative'>
							<User className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								id={rutId}
								name='rut'
								className='h-10 pl-9'
								placeholder='12.345.678-5'
								autoComplete='username'
								onChange={e =>
									formik.setFieldValue('rut', formatRut(e.target.value))
								}
								value={formik.values.rut}
							/>
						</div>
					</div>

					<div className='space-y-1.5'>
						<Label htmlFor={passId}>Contraseña</Label>
						<div className='relative'>
							<Lock className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								id={passId}
								name='password'
								type={showPassword ? 'text' : 'password'}
								className='h-10 pl-9 pr-9'
								placeholder='Ingresa tu contraseña'
								autoComplete='current-password'
								onChange={formik.handleChange}
								value={formik.values.password}
							/>
							<button
								type='button'
								className='absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground'
								onClick={() => setShowPassword(s => !s)}
								tabIndex={-1}
								aria-label={
									showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
								}
							>
								{showPassword ? (
									<EyeOff className='size-4' />
								) : (
									<Eye className='size-4' />
								)}
							</button>
						</div>
					</div>

					{error && (
						<div
							role='alert'
							className='flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive'
						>
							<AlertCircle className='size-4 shrink-0' />
							<FormError>{error}</FormError>
						</div>
					)}
				</CardContent>

				<CardFooter className='flex-col gap-3 pt-2'>
					<Button type='submit' className='h-10 w-full' disabled={cargando}>
						{cargando ? (
							<>
								<Loader2 className='size-4 animate-spin' />
								Iniciando sesión…
							</>
						) : (
							'Iniciar sesión'
						)}
					</Button>
				</CardFooter>
			</Form>
		</Card>
	)
}

export default LoginForm
