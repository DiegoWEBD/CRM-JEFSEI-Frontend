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
import { Eye, EyeOff, Loader2, User, Lock, AlertCircle } from 'lucide-react'
import { useState } from 'react'

function formatRut(value: string): string {
	const clean = value.replace(/[^0-9kK]/g, '').toUpperCase()
	if (clean.length <= 1) return clean
	const dv = clean.slice(-1)
	const body = clean.slice(0, -1)
	const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
	return `${formatted}-${dv}`
}

const LoginForm = () => {
	const { cargando, error, login } = useAuth()
	const [showPassword, setShowPassword] = useState(false)

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
		<Card className='w-110 shadow-lg'>
			<Form onSubmit={formik.handleSubmit}>
				<LoginFormHeader />
				<CardContent className='space-y-4'>
					<div className='space-y-1.5'>
						<Label>Rut</Label>
						<div className='relative'>
							<User className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								name='rut'
								className='pl-9'
								placeholder='12.345.678-5'
								onChange={e =>
									formik.setFieldValue('rut', formatRut(e.target.value))
								}
								value={formik.values.rut}
							/>
						</div>
					</div>

					<div className='space-y-1.5'>
						<Label>Contraseña</Label>
						<div className='relative'>
							<Lock className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								name='password'
								type={showPassword ? 'text' : 'password'}
								className='pl-9 pr-9'
								placeholder='Ingrese su contraseña'
								onChange={formik.handleChange}
								value={formik.values.password}
							/>
							<button
								type='button'
								className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
								onClick={() => setShowPassword(!showPassword)}
								tabIndex={-1}
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
						<div className='flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive'>
							<AlertCircle className='size-4 shrink-0' />
							<FormError>{error}</FormError>
						</div>
					)}
				</CardContent>

				<CardFooter className='flex-col gap-3'>
					<Button type='submit' className='w-full' disabled={cargando}>
						{cargando ? (
							<>
								<Loader2 className='mr-2 size-4 animate-spin' />
								Iniciando sesión…
							</>
						) : (
							'Iniciar Sesión'
						)}
					</Button>
					<p className='text-[10px] text-muted-foreground'>
						v1.0.0 · JEFSEI © 2026
					</p>
				</CardFooter>
			</Form>
		</Card>
	)
}

export default LoginForm
