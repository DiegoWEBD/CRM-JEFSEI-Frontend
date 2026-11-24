'use client'

import InicialesUsuario from '@/app/personal/components/iniciales-usuario'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import DialogCambiarPassword from '@/components/dialog-cambiar-password/dialog-cambiar-password'
import Campo from '@/components/forms/campo/campo'
import { Input } from '@/components/input'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { useActualizarPerfil } from '@/hooks/usuarios/use-actualizar-perfil'
import { useUsuario } from '@/hooks/usuarios/use-usuario'
import { useFormik } from 'formik'
import {
	Building2,
	CalendarDays,
	IdCard,
	Mail,
	Pencil,
	Phone,
	Target,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import * as Yup from 'yup'
import { PerfilPageSkeleton } from './perfil-page-skeleton'
import { cn } from '@/lib/utils'

type PerfilClientProps = {
	rut: string
}

function mensajeDeError(error: unknown): string | undefined {
	return (error as { response?: { data?: { error?: string } } })?.response?.data
		?.error
}

function DatoSoloLectura({
	label,
	valor,
	icono,
	accion,
}: {
	label: string
	valor: string
	icono?: React.ReactNode
	accion?: React.ReactNode
}) {
	return (
		<div className='space-y-1'>
			<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
				{label}
			</p>
			<div className='flex items-center gap-1.5 text-sm text-foreground'>
				{icono}
				<span className='truncate'>{valor}</span>
				{accion}
			</div>
		</div>
	)
}

export default function PerfilClient({ rut }: PerfilClientProps) {
	const { data: usuario, isFetching } = useUsuario(rut)
	const actualizarPerfil = useActualizarPerfil()
	const [editandoNombre, setEditandoNombre] = useState(false)
	const [dialogPasswordAbierto, setDialogPasswordAbierto] = useState(false)

	const formikNombre = useFormik({
		enableReinitialize: true,
		initialValues: {
			nombre: usuario?.nombre ?? '',
		},
		validationSchema: Yup.object({
			nombre: Yup.string()
				.trim()
				.min(2, 'El nombre debe tener al menos 2 caracteres')
				.max(120, 'El nombre no puede exceder 120 caracteres')
				.required('El nombre es obligatorio'),
		}),
		onSubmit: async values => {
			try {
				await actualizarPerfil.mutateAsync({
					rut,
					request: { nombre: values.nombre.trim() },
				})
				toast.success('Nombre actualizado')
				setEditandoNombre(false)
			} catch (error) {
				toast.error(mensajeDeError(error) ?? 'Error al actualizar el perfil')
			}
		},
	})

	function iniciarEdicionNombre() {
		formikNombre.resetForm()
		setEditandoNombre(true)
	}

	function cancelarEdicionNombre() {
		formikNombre.resetForm()
		setEditandoNombre(false)
	}

	if (isFetching && !usuario) {
		return <PerfilPageSkeleton />
	}

	if (!usuario) {
		return (
			<PanelLayout>
				<div className='flex items-center justify-center rounded-lg border border-border bg-card py-12'>
					<p className='text-sm text-muted-foreground'>
						No se pudo cargar la información del perfil.
					</p>
				</div>
			</PanelLayout>
		)
	}

	const nombreCambiado = formikNombre.values.nombre.trim() !== usuario.nombre

	const comision =
		usuario.porcentaje_comision != null
			? `${(usuario.porcentaje_comision * 100).toFixed(2)}%`
			: '—'

	const fechaRegistro = usuario.fecha_registro
		? new Date(usuario.fecha_registro).toLocaleDateString('es-CL')
		: '—'

	return (
		<PanelLayout>
			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-4 sm:p-6'>
					<div className='flex flex-wrap items-center gap-3'>
						<InicialesUsuario nombre={usuario.nombre} />
						<div className='min-w-0'>
							<h1 className='truncate text-lg font-semibold text-foreground'>
								{usuario.nombre}
							</h1>
							<p className='text-sm text-muted-foreground'>{usuario.rut}</p>
						</div>
						<div className='flex flex-wrap gap-1'>
							{usuario.roles.map(rol => (
								<Badge
									key={rol.codigo}
									variant='pastel-sky'
									className='text-xs font-medium'
								>
									{rol.nombre}
								</Badge>
							))}
						</div>
					</div>
				</div>

				<div className='space-y-4 p-4 sm:p-6'>
					<Card className='border-border bg-card shadow-none'>
						<CardHeader className='pb-2 pt-3'>
							<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
								Mis datos
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4 pb-4'>
							{editandoNombre ? (
								<form onSubmit={formikNombre.handleSubmit}>
									<div className='grid gap-3 sm:grid-cols-2'>
										<Campo label='Nombre'>
											<Input
												name='nombre'
												value={formikNombre.values.nombre}
												onChange={formikNombre.handleChange}
												onBlur={formikNombre.handleBlur}
												className={cn(
													'h-9 text-sm shadow-none',
													!editandoNombre &&
														'border-none p-0 text-sm text-foreground',
												)}
											/>
											{formikNombre.touched.nombre &&
												formikNombre.errors.nombre && (
													<p className='text-xs text-destructive'>
														{formikNombre.errors.nombre}
													</p>
												)}
										</Campo>
									</div>
									<div className='mt-3 flex justify-end gap-2'>
										<Button
											type='button'
											variant='outline'
											size='sm'
											className='h-9 text-xs'
											onClick={cancelarEdicionNombre}
										>
											Cancelar
										</Button>
										<Button
											type='submit'
											size='sm'
											className='h-9 text-xs'
											disabled={actualizarPerfil.isPending || !nombreCambiado}
										>
											{actualizarPerfil.isPending
												? 'Guardando...'
												: 'Guardar cambios'}
										</Button>
									</div>
								</form>
							) : (
								<DatoSoloLectura
									label='Nombre'
									valor={usuario.nombre}
									accion={
										<Button
											type='button'
											variant='outline'
											size='sm'
											className='ml-1 h-7 gap-1 text-xs'
											onClick={iniciarEdicionNombre}
										>
											<Pencil className='size-3' />
											Editar
										</Button>
									}
								/>
							)}

							<div className='grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3'>
								<DatoSoloLectura
									label='RUT'
									valor={usuario.rut}
									icono={
										<IdCard className='size-3.5 shrink-0 text-muted-foreground' />
									}
								/>
								<DatoSoloLectura
									label='Correo'
									valor={usuario.correo || '—'}
									icono={
										<Mail className='size-3.5 shrink-0 text-muted-foreground' />
									}
								/>
								<DatoSoloLectura
									label='Teléfono'
									valor={usuario.telefono || '—'}
									icono={
										<Phone className='size-3.5 shrink-0 text-muted-foreground' />
									}
								/>
								<DatoSoloLectura
									label='Sucursal'
									valor={usuario.sucursal || '—'}
									icono={
										<Building2 className='size-3.5 shrink-0 text-muted-foreground' />
									}
								/>
								<DatoSoloLectura
									label='Meta mensual'
									valor={
										usuario.meta_mensual_uf != null
											? `${usuario.meta_mensual_uf} UF`
											: '—'
									}
									icono={
										<Target className='size-3.5 shrink-0 text-muted-foreground' />
									}
								/>
								<DatoSoloLectura label='Comisión' valor={comision} />
								<DatoSoloLectura
									label='Fecha de registro'
									valor={fechaRegistro}
									icono={
										<CalendarDays className='size-3.5 shrink-0 text-muted-foreground' />
									}
								/>
							</div>

							<div className='flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4'>
								<p className='text-xs text-muted-foreground'>
									Al cambiar tu contraseña se cerrarán las sesiones en tus otros
									dispositivos.
								</p>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-9 text-xs'
									onClick={() => setDialogPasswordAbierto(true)}
								>
									Cambiar contraseña
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
			<DialogCambiarPassword
				open={dialogPasswordAbierto}
				onOpenChange={setDialogPasswordAbierto}
				rut={rut}
			/>
		</PanelLayout>
	)
}
