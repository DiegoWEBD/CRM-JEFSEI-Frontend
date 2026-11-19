'use client'

import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import Campo from '@/components/forms/campo/campo'
import { Input } from '@/components/input'
import { useCambiarPassword } from '@/hooks/usuarios/use-cambiar-password'
import { esquemaPassword, REQUISITOS_PASSWORD } from '@/lib/validacion-password'
import { useFormik } from 'formik'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import * as Yup from 'yup'

type DialogCambiarPasswordProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	rut: string
}

function mensajeDeError(error: unknown): string | undefined {
	return (error as { response?: { data?: { error?: string } } })?.response?.data
		?.error
}

export default function DialogCambiarPassword({
	open,
	onOpenChange,
	rut,
}: DialogCambiarPasswordProps) {
	const cambiarPassword = useCambiarPassword()
	const [showPassword, setShowPassword] = useState(false)

	const formik = useFormik({
		initialValues: {
			passwordActual: '',
			passwordNueva: '',
			confirmacion: '',
		},
		validationSchema: Yup.object({
			passwordActual: Yup.string().required(
				'La contraseña actual es obligatoria',
			),
			passwordNueva: esquemaPassword(true),
			confirmacion: Yup.string()
				.oneOf([Yup.ref('passwordNueva')], 'Las contraseñas no coinciden')
				.required('Debe confirmar la nueva contraseña'),
		}),
		onSubmit: async (values, { resetForm }) => {
			try {
				await cambiarPassword.mutateAsync({
					rut,
					request: {
						password_actual: values.passwordActual,
						password_nueva: values.passwordNueva,
					},
				})
				toast.success(
					'Contraseña actualizada. Se cerraron las sesiones en otros dispositivos',
				)
				resetForm()
				onOpenChange(false)
			} catch (error) {
				toast.error(
					mensajeDeError(error) ?? 'Error al actualizar la contraseña',
				)
			}
		},
	})

	function handleOpenChange(nuevoOpen: boolean) {
		if (!nuevoOpen) {
			formik.resetForm()
			setShowPassword(false)
		}
		onOpenChange(nuevoOpen)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>Cambiar contraseña</DialogTitle>
					<DialogDescription>{REQUISITOS_PASSWORD}</DialogDescription>
				</DialogHeader>
				<form onSubmit={formik.handleSubmit}>
					<div className='space-y-3'>
						<Campo label='Contraseña actual'>
							<Input
								name='passwordActual'
								type={showPassword ? 'text' : 'password'}
								className='h-9 pr-9 text-sm shadow-none'
								placeholder='••••••••'
								value={formik.values.passwordActual}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.touched.passwordActual &&
								formik.errors.passwordActual && (
									<p className='text-xs text-destructive'>
										{formik.errors.passwordActual}
									</p>
								)}
						</Campo>

						<Campo label='Nueva contraseña'>
							<div className='relative'>
								<Input
									name='passwordNueva'
									type={showPassword ? 'text' : 'password'}
									className='h-9 pr-9 text-sm shadow-none'
									placeholder='••••••••'
									value={formik.values.passwordNueva}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								<button
									type='button'
									className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
									onClick={() => setShowPassword(!showPassword)}
									tabIndex={-1}
									aria-label={
										showPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'
									}
								>
									{showPassword ? (
										<EyeOff className='size-4' />
									) : (
										<Eye className='size-4' />
									)}
								</button>
							</div>
							{formik.touched.passwordNueva && formik.errors.passwordNueva && (
								<p className='text-xs text-destructive'>
									{formik.errors.passwordNueva}
								</p>
							)}
						</Campo>

						<Campo label='Confirmar contraseña'>
							<Input
								name='confirmacion'
								type={showPassword ? 'text' : 'password'}
								className='h-9 text-sm shadow-none'
								placeholder='••••••••'
								value={formik.values.confirmacion}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.touched.confirmacion && formik.errors.confirmacion && (
								<p className='text-xs text-destructive'>
									{formik.errors.confirmacion}
								</p>
							)}
						</Campo>

						<p className='text-xs text-muted-foreground'>
							Al cambiarla se cerrarán las sesiones en tus otros dispositivos.
						</p>
					</div>

					<DialogFooter className='mt-4'>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-9 text-xs'
							onClick={() => handleOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button
							type='submit'
							size='sm'
							className='h-9 text-xs'
							disabled={cambiarPassword.isPending}
						>
							{cambiarPassword.isPending
								? 'Cambiando...'
								: 'Cambiar contraseña'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
