'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Skeleton } from '@/components/skeleton'
import { Badge } from '@/components/badge'
import { Checkbox } from '@/components/checkbox'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from '@/components/dialog'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Campo from '@/components/forms/campo/campo'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/table'
import Usuario from '@/dominio/usuario/usuario'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import { useRegistrarUsuario } from '@/hooks/usuarios/use-registrar-usuario'
import { useSucursales } from '@/hooks/sucursales/use-sucursales'
import { useControlledInput } from '@/hooks/input/use-controlled-input'
import { RegistrarUsuarioRequest } from '@/aplicacion/usuarios/use-cases/registrar-usuario'
import { useActualizarUsuario } from '@/hooks/usuarios/use-actualizar-usuario'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { useObtenerRoles, type RolJson } from '@/hooks/roles/use-obtener-roles'
import { useEliminarUsuario } from '@/hooks/usuarios/use-eliminar-usuario'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { classInputRut } from '@/utils/class-input-rut'
import { formatRut } from '@/utils/format-rut'
import {
	rutChilenoEstadoValidacion,
	rutChilenoEsValido,
} from '@/utils/validar-rut'
import { useState, useMemo } from 'react'
import {
	Search,
	UserPlus,
	ExternalLink,
	Mail,
	Phone,
	Building2,
	Eye,
	EyeOff,
} from 'lucide-react'
import AuthGuard from '@/components/layouts/guards/auth-guard'

function InicialesUsuario({ nombre }: { nombre: string }) {
	const iniciales = nombre
		.split(' ')
		.map(p => p.charAt(0).toUpperCase())
		.slice(0, 2)
		.join('')

	return (
		<div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-highlight-light text-xs font-semibold text-primary-highlight'>
			{iniciales}
		</div>
	)
}

function CardUsuario({
	usuario,
	onVerDetalle,
	onEliminar,
}: {
	usuario: Usuario
	onVerDetalle: (usuario: Usuario) => void
	onEliminar?: (usuario: Usuario) => void
}) {
	return (
		<Card className='overflow-hidden transition-shadow hover:shadow-md'>
			<CardContent className='p-4'>
				<div className='flex items-start gap-3'>
					<InicialesUsuario nombre={usuario.nombre} />

					<div className='min-w-0 flex-1 space-y-1.5'>
						<h3 className='truncate text-sm font-semibold leading-tight text-foreground'>
							{usuario.nombre}
						</h3>

						<div className='flex flex-wrap items-center gap-1'>
							{usuario.roles.map(rol => (
								<Badge
									key={rol.codigo}
									variant='outline'
									className='border-border bg-muted/40 text-[9px] font-medium text-muted-foreground'
								>
									{rol.nombre}
								</Badge>
							))}
						</div>

						{usuario.sucursal && (
							<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
								<Building2 className='size-3 shrink-0' />
								<span className='truncate'>{usuario.sucursal}</span>
							</div>
						)}

						{usuario.correo && (
							<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
								<Mail className='size-3 shrink-0' />
								<span className='truncate'>{usuario.correo}</span>
							</div>
						)}

						{usuario.telefono && (
							<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
								<Phone className='size-3 shrink-0' />
								<span>{usuario.telefono}</span>
							</div>
						)}

						<Badge
							variant='outline'
							className={cn(
								'text-[9px] font-medium',
								usuario.habilitado
									? 'border-emerald-500/45 bg-emerald-500/10 text-emerald-700'
									: 'border-destructive/35 bg-destructive/10 text-destructive',
							)}
						>
							{usuario.habilitado ? 'Habilitado' : 'Deshabilitado'}
						</Badge>
					</div>

					<Button
						variant='outline'
						size='sm'
						className='mt-0.5 shrink-0 gap-1 text-xs'
						onClick={() => onVerDetalle(usuario)}
					>
						<ExternalLink className='size-3' />
						<span className='hidden sm:inline'>Ver detalle</span>
					</Button>
					{onEliminar && (
						<Button
							variant='destructive'
							size='sm'
							className='mt-0.5 shrink-0 gap-1 text-xs'
							onClick={() => onEliminar(usuario)}
						>
							Eliminar
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

type Props = {
	usuariosIniciales: Usuario[]
}

export default function PersonalClient({ usuariosIniciales }: Props) {
	const { data: usuarios, isLoading } = useUsuarios(usuariosIniciales)
	const { value: busqueda, handleChange } = useControlledInput()
	const { data: roles } = useObtenerRoles()
	const rolesList = roles ?? []
	const { tieneRol } = useUserSession()
	const eliminarMutation = useEliminarUsuario()

	const [usuarioDetalle, setUsuarioDetalle] = useState<Usuario | null>(null)
	const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null)
	const [registrarAbierto, setRegistrarAbierto] = useState(false)

	const lista = usuarios ?? usuariosIniciales

	const usuariosFiltrados = useMemo(() => {
		if (!lista) return []
		if (!busqueda.trim()) return lista

		const q = busqueda.trim().toLowerCase()
		return lista.filter(
			u =>
				u.nombre.toLowerCase().includes(q) ||
				u.rut.toLowerCase().includes(q) ||
				(u.correo ?? '').toLowerCase().includes(q) ||
				(u.telefono ?? '').includes(q) ||
				u.sucursal.toLowerCase().includes(q) ||
				u.roles.some(r => r.nombre.toLowerCase().includes(q)),
		)
	}, [lista, busqueda])

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<Skeleton className='h-9 w-full rounded-md' />
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<Card key={i}>
							<CardContent className='flex items-start gap-3 p-4'>
								<Skeleton className='size-10 shrink-0 rounded-full' />
								<div className='min-w-0 flex-1 space-y-2'>
									<Skeleton className='h-5 w-3/4' />
									<Skeleton className='h-3 w-1/2' />
									<Skeleton className='h-3 w-2/3' />
									<Skeleton className='h-3 w-1/3' />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between gap-3'>
				<div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
					<Building2 className='size-4' />
					<span>
						{usuariosFiltrados.length} usuario
						{usuariosFiltrados.length !== 1 ? 's' : ''}
					</span>
				</div>

				<AuthGuard allowedRoles={['GERENTE_GENERAL']}>
					<Button
						size='sm'
						className='h-9 text-xs'
						onClick={() => setRegistrarAbierto(true)}
					>
						<UserPlus className='mr-1.5 size-3.5' />
						Registrar usuario
					</Button>
				</AuthGuard>
			</div>

			<div className='relative'>
				<Search className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					placeholder='Buscar por nombre, rut, correo, teléfono, sucursal o rol...'
					className='h-9 pl-9 text-sm shadow-none'
					value={busqueda}
					onChange={handleChange}
				/>
			</div>

			{usuariosFiltrados.length === 0 ? (
				<Card>
					<CardContent className='flex flex-col items-center gap-2 py-12'>
						<Building2 className='size-10 text-muted-foreground/40' />
						<p className='text-sm text-muted-foreground'>
							{busqueda.trim()
								? 'No se encontraron usuarios que coincidan con la búsqueda.'
								: 'No hay usuarios registrados.'}
						</p>
					</CardContent>
				</Card>
			) : (
				<>
					{/* Cards: mobile */}
					<div className='grid gap-4 sm:hidden'>
						{usuariosFiltrados.map(usuario => (
							<CardUsuario
								key={usuario.rut}
								usuario={usuario}
								onVerDetalle={setUsuarioDetalle}
								onEliminar={
									tieneRol('GERENTE_GENERAL') ? setUsuarioAEliminar : undefined
								}
							/>
						))}
					</div>

					{/* Tabla: desktop */}
					<div className='hidden sm:block w-full overflow-x-auto rounded-md border border-border'>
						<Table className='[&_td]:whitespace-nowrap [&_th]:whitespace-nowrap'>
							<TableHeader>
								<TableRow className='hover:bg-transparent'>
									<TableHead className='text-[10px] font-semibold uppercase text-muted-foreground'>
										Nombre
									</TableHead>
									<TableHead className='text-[10px] font-semibold uppercase text-muted-foreground'>
										Rol
									</TableHead>
									<TableHead className='text-[10px] font-semibold uppercase text-muted-foreground'>
										Sucursal
									</TableHead>
									<TableHead className='text-[10px] font-semibold uppercase text-muted-foreground'>
										Contacto
									</TableHead>
									<TableHead className='text-[10px] font-semibold uppercase text-muted-foreground'>
										Estado
									</TableHead>
									<TableHead className='text-right text-[10px] font-semibold uppercase text-muted-foreground'>
										Acción
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{usuariosFiltrados.map(usuario => (
									<TableRow key={usuario.rut} className='text-xs'>
										<TableCell>
											<div className='flex items-center gap-2'>
												<InicialesUsuario nombre={usuario.nombre} />
												<div>
													<div className='font-medium'>{usuario.nombre}</div>
													<div className='text-[10px] text-muted-foreground'>
														{usuario.rut}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className='flex flex-wrap gap-1'>
												{usuario.roles.map(rol => (
													<Badge
														key={rol.codigo}
														variant='outline'
														className='border-border bg-muted/40 text-[9px] font-medium text-muted-foreground'
													>
														{rol.nombre}
													</Badge>
												))}
											</div>
										</TableCell>
										<TableCell className='text-muted-foreground'>
											{usuario.sucursal || '—'}
										</TableCell>
										<TableCell>
											<div className='text-muted-foreground'>
												{usuario.correo || '—'}
											</div>
											<div className='text-[10px] text-muted-foreground'>
												{usuario.telefono || '—'}
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant='outline'
												className={cn(
													'text-[9px] font-medium',
													usuario.habilitado
														? 'border-emerald-500/45 bg-emerald-500/10 text-emerald-700'
														: 'border-destructive/35 bg-destructive/10 text-destructive',
												)}
											>
												{usuario.habilitado ? 'Habilitado' : 'Deshabilitado'}
											</Badge>
										</TableCell>
										<TableCell className='text-right'>
											<div className='flex items-center justify-end gap-1'>
												<Button
													size='sm'
													variant='outline'
													className='h-7 text-[10px]'
													onClick={() => setUsuarioDetalle(usuario)}
												>
													Ver detalle
												</Button>
												{tieneRol('GERENTE_GENERAL') && (
													<Button
														size='sm'
														variant='destructive'
														className='h-7 text-[10px]'
														onClick={() => setUsuarioAEliminar(usuario)}
													>
														Eliminar
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</>
			)}

			<DialogEditarUsuario
				usuario={usuarioDetalle}
				onOpenChange={open => {
					if (!open) setUsuarioDetalle(null)
				}}
				rolesList={rolesList}
			/>

			<DialogRegistrarUsuario
				abierto={registrarAbierto}
				onOpenChange={setRegistrarAbierto}
				rolesList={rolesList}
			/>

			<ConfirmDialog
				open={usuarioAEliminar !== null}
				onOpenChange={() => setUsuarioAEliminar(null)}
				title='¿Eliminar usuario?'
				description={`${usuarioAEliminar?.nombre ?? ''} no podrá iniciar sesión.`}
				confirmText='Eliminar'
				onConfirm={() => {
					if (usuarioAEliminar) {
						eliminarMutation.mutate(usuarioAEliminar.rut)
						setUsuarioAEliminar(null)
					}
				}}
				isPending={eliminarMutation.isPending}
			/>
		</div>
	)
}

function InputTelefono({
	value,
	onChange,
	disabled,
}: {
	value: string
	onChange: (value: string) => void
	disabled?: boolean
}) {
	return (
		<div className='flex items-center rounded-md border border-input bg-background shadow-none'>
			<span className='flex items-center bg-muted px-3 text-sm text-muted-foreground border-r border-input self-stretch rounded-l-md'>
				+569
			</span>
			<input
				className='flex h-9 w-full bg-transparent px-3 py-1 text-sm shadow-none outline-none'
				maxLength={8}
				inputMode='numeric'
				value={value}
				disabled={disabled}
				onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 8))}
			/>
		</div>
	)
}

type RegistrarFormValues = {
	rut: string
	nombre: string
	correo: string | null
	telefono: string | null
	idSucursal: number | null
	password: string
	roles: string[]
	metaMensualUf: number | null
	porcentajeComision: number | null
}

function DialogRegistrarUsuario({
	abierto,
	onOpenChange,
	rolesList,
}: {
	abierto: boolean
	onOpenChange: (open: boolean) => void
	rolesList: RolJson[]
}) {
	const { data: sucursales } = useSucursales()
	const mutation = useRegistrarUsuario()
	const [showPassword, setShowPassword] = useState(false)

	const validationSchema = Yup.object({
		nombre: Yup.string().required('El nombre es obligatorio'),
		rut: Yup.string()
			.required('El RUT es obligatorio')
			.test(
				'rut-valido',
				'El RUT ingresado no es válido',
				v => !v || rutChilenoEsValido(v),
			),
		telefono: Yup.string().matches(/^\d{8}$/, 'Debe tener 8 dígitos'),
		idSucursal: Yup.number()
			.typeError('Debe seleccionar una sucursal')
			.required('Debe seleccionar una sucursal'),
		password: Yup.string()
			.required('La contraseña es obligatoria')
			.min(6, 'Mínimo 6 caracteres'),
		roles: Yup.array().min(1, 'Debe seleccionar al menos un rol'),
	})

	const formik = useFormik<RegistrarFormValues>({
		enableReinitialize: true,
		initialValues: {
			nombre: '',
			rut: '',
			correo: '',
			telefono: '',
			idSucursal: null,
			password: '',
			roles: [],
			metaMensualUf: null,
			porcentajeComision: null,
		},
		validationSchema,
		onSubmit: async values => {
			const request: RegistrarUsuarioRequest = {
				rut: values.rut.replace(/[^0-9kK]/g, '').toUpperCase(),
				nombre: values.nombre.trim(),
				correo: values.correo?.trim() || null,
				telefono:
					values.telefono?.length === 8 ? '+569' + values.telefono : null,
				id_sucursal: values.idSucursal!,
				password: values.password,
				codigo_roles: values.roles,
				meta_mensual_uf: values.metaMensualUf
					? Number(values.metaMensualUf)
					: null,
				porcentaje_comision: values.porcentajeComision
					? Number(values.porcentajeComision) / 100
					: null,
			}
			await mutation.mutateAsync(request)
			onOpenChange(false)
		},
	})

	const handleOpenChange = (open: boolean) => {
		if (!open) formik.resetForm()
		onOpenChange(open)
	}

	return (
		<Dialog open={abierto} onOpenChange={handleOpenChange}>
			<DialogContent className='max-h-[90vh] overflow-y-auto p-0 sm:max-w-xl'>
				<div className='border-b border-border px-6 py-4'>
					<DialogTitle className='text-lg font-semibold'>
						Registrar usuario
					</DialogTitle>
					<DialogDescription className='text-sm text-muted-foreground'>
						Completa los datos del nuevo usuario.
					</DialogDescription>
				</div>

				<form onSubmit={formik.handleSubmit}>
					<div className='space-y-4 px-6 py-4'>
						<div className='grid gap-4 sm:grid-cols-2'>
							<div className='space-y-1.5'>
								<Label htmlFor='rut-crear'>RUT *</Label>
								<Input
									id='rut-crear'
									placeholder='12.345.678-9'
									className={classInputRut(
										formik.touched.rut && formik.errors.rut
											? 'dv_invalido'
											: rutChilenoEstadoValidacion(formik.values.rut),
									)}
									value={formik.values.rut}
									onChange={e =>
										formik.setFieldValue('rut', formatRut(e.target.value))
									}
									onBlur={formik.handleBlur}
									maxLength={14}
								/>
								{formik.touched.rut && formik.errors.rut && (
									<p className='text-[10px] text-destructive'>
										{formik.errors.rut}
									</p>
								)}
							</div>
							<div className='space-y-1.5'>
								<Label htmlFor='nombre-crear'>Nombre *</Label>
								<Input
									id='nombre-crear'
									placeholder='Nombre completo'
									name='nombre'
									className='h-9 text-sm shadow-none'
									value={formik.values.nombre}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.nombre && formik.errors.nombre && (
									<p className='text-[10px] text-destructive'>
										{formik.errors.nombre}
									</p>
								)}
							</div>
							<div className='space-y-1.5'>
								<Label htmlFor='correo-crear'>Correo</Label>
								<Input
									id='correo-crear'
									type='email'
									placeholder='correo@ejemplo.cl'
									name='correo'
									className='h-9 text-sm shadow-none'
									value={formik.values.correo || ''}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							</div>
							<div className='space-y-1.5'>
								<Label htmlFor='telefono-crear'>Teléfono</Label>
								<InputTelefono
									value={formik.values.telefono || ''}
									onChange={v => formik.setFieldValue('telefono', v)}
								/>
								{formik.touched.telefono && formik.errors.telefono && (
									<p className='text-[10px] text-destructive'>
										{formik.errors.telefono}
									</p>
								)}
							</div>
							<div className='space-y-1.5'>
								<Label htmlFor='sucursal-crear'>Sucursal *</Label>
								<Select
									value={
										formik.values.idSucursal != null
											? String(formik.values.idSucursal)
											: ''
									}
									onValueChange={(v: string) =>
										formik.setFieldValue('idSucursal', Number(v))
									}
								>
									<SelectTrigger
										id='sucursal-crear'
										className='h-9 text-sm shadow-none'
									>
										<SelectValue placeholder='Seleccionar sucursal' />
									</SelectTrigger>
									<SelectContent>
										{sucursales?.map(s => (
											<SelectItem key={s.id} value={String(s.id)}>
												{s.nombre}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{formik.touched.idSucursal && formik.errors.idSucursal && (
									<p className='text-[10px] text-destructive'>
										{formik.errors.idSucursal}
									</p>
								)}
							</div>
							<div className='space-y-1.5'>
								<Label htmlFor='password-crear'>Contraseña *</Label>
								<div className='relative'>
								<Input
									id='password-crear'
									type={showPassword ? 'text' : 'password'}
									className='h-9 text-sm shadow-none pr-9'
									placeholder='••••••••'
									name='password'
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
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
								{formik.touched.password && formik.errors.password && (
									<p className='text-[10px] text-destructive'>
										{formik.errors.password}
									</p>
								)}
							</div>
						</div>

						<div className='space-y-1.5'>
							<Label>Roles *</Label>
							<div className='grid gap-1.5 sm:grid-cols-2'>
								{rolesList.map(rol => (
									<label
										key={rol.codigo}
										className='flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted/40'
									>
										<Checkbox
											checked={formik.values.roles.includes(rol.codigo)}
											onCheckedChange={() => {
												const nuevos = formik.values.roles.includes(rol.codigo)
													? formik.values.roles.filter(r => r !== rol.codigo)
													: [...formik.values.roles, rol.codigo]
												formik.setFieldValue('roles', nuevos)
											}}
										/>
										{rol.nombre}
									</label>
								))}
							</div>
							{formik.touched.roles && formik.errors.roles && (
								<p className='text-[10px] text-destructive'>
									{formik.errors.roles}
								</p>
							)}
						</div>

						<div className='grid gap-4 sm:grid-cols-3'>
							<div className='space-y-1.5'>
								<Label htmlFor='metaMensual-crear'>Meta mensual UF</Label>
							<Input
								id='metaMensual-crear'
								type='number'
								min='0'
								placeholder='0'
								name='metaMensualUf'
								className='h-9 text-sm shadow-none'
								value={formik.values.metaMensualUf || undefined}
								onChange={formik.handleChange}
							/>
							</div>
							<div className='space-y-1.5'>
								<Label htmlFor='comision-crear'>Comisión %</Label>
							<Input
								id='comision-crear'
								type='number'
								min='0'
								max='100'
								step='0.01'
								placeholder='0'
								name='porcentajeComision'
								className='h-9 text-sm shadow-none'
								value={formik.values.porcentajeComision || undefined}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
								{formik.touched.porcentajeComision &&
									formik.errors.porcentajeComision && (
										<p className='text-[10px] text-destructive'>
											{formik.errors.porcentajeComision}
										</p>
									)}
							</div>
						</div>
					</div>

					<div className='flex items-center justify-end gap-2 border-t border-border px-6 py-4'>
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
							disabled={mutation.isPending}
						>
							{mutation.isPending ? 'Registrando...' : 'Registrar'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}

type EditarUsuarioFormValues = {
	nombre: string
	rut: string
	correo: string
	telefono: string
	idSucursal: number | null
	roles: string[]
	password: string
	metaMensualUf: string
	porcentajeComision: string
	habilitado: boolean
}

function DialogEditarUsuario({
	usuario,
	onOpenChange,
	rolesList,
}: {
	usuario: Usuario | null
	onOpenChange: (open: boolean) => void
	rolesList: RolJson[]
}) {
	const { data: sucursales } = useSucursales()
	const mutation = useActualizarUsuario()
	const { tieneRol } = useUserSession()
	const puedeEditar = tieneRol('GERENTE_GENERAL')
	const [showPassword, setShowPassword] = useState(false)

	const validationSchema = Yup.object({
		nombre: Yup.string().required('El nombre es obligatorio'),
		correo: Yup.string().email('Correo inválido').nullable(),
		telefono: Yup.string().matches(/^\d{0,8}$/, 'Debe tener hasta 8 dígitos'),
		idSucursal: Yup.number()
			.typeError('Debe seleccionar una sucursal')
			.required('Debe seleccionar una sucursal'),
		roles: Yup.array().min(1, 'Debe seleccionar al menos un rol'),
		password: Yup.string().test(
			'min',
			'Mínimo 6 caracteres',
			v => !v || v.length >= 6,
		),
		porcentajeComision: Yup.string().test(
			'max',
			'El porcentaje no puede superar 100',
			v => !v || Number(v) <= 100,
		),
	})

	const formik = useFormik<EditarUsuarioFormValues>({
		enableReinitialize: true,
		initialValues: {
			nombre: usuario?.nombre ?? '',
			rut: usuario?.rut ?? '',
			correo: usuario?.correo ?? '',
			telefono:
				usuario?.telefono && usuario.telefono.startsWith('+569')
					? usuario.telefono.slice(4)
					: '',
			idSucursal: (() => {
				if (!usuario?.sucursal) return null
				const found = sucursales?.find(s => s.nombre === usuario.sucursal)
				return found?.id ?? null
			})(),
			roles: usuario?.roles.map(r => r.codigo) ?? [],
			password: '',
			metaMensualUf:
				usuario?.meta_mensual_uf != null ? String(usuario.meta_mensual_uf) : '',
			porcentajeComision:
				usuario?.porcentaje_comision != null
					? String(usuario.porcentaje_comision * 100)
					: '',
			habilitado: usuario?.habilitado ?? true,
		},
		validationSchema,
		onSubmit: values => {
			mutation.mutate({
				rut: values.rut,
				nombre: values.nombre,
				correo: values.correo || null,
				telefono:
					values.telefono.length === 8 ? '+569' + values.telefono : null,
				id_sucursal: values.idSucursal!,
				password: values.password || undefined,
				meta_mensual_uf: values.metaMensualUf
					? Number(values.metaMensualUf)
					: null,
				codigo_roles: values.roles,
				porcentaje_comision: values.porcentajeComision
					? Number(values.porcentajeComision) / 100
					: null,
				habilitado: values.habilitado,
			})
			onOpenChange(false)
		},
	})

	const toggleRol = (codigo: string) => {
		const nuevos = formik.values.roles.includes(codigo)
			? formik.values.roles.filter(r => r !== codigo)
			: [...formik.values.roles, codigo]
		formik.setFieldValue('roles', nuevos)
	}

	return (
		<Dialog open={usuario != null} onOpenChange={onOpenChange}>
			<DialogContent className='max-h-[90vh] overflow-y-auto p-0 sm:max-w-xl'>
				<div className='border-b border-border px-6 py-4'>
					<DialogTitle className='text-lg font-semibold'>
						{puedeEditar ? 'Editar usuario' : 'Detalle del usuario'}
					</DialogTitle>
					<DialogDescription className='text-sm text-muted-foreground'>
						{puedeEditar
							? 'Modifica los datos del usuario.'
							: 'Información del usuario.'}
					</DialogDescription>
				</div>

				<form onSubmit={formik.handleSubmit}>
					<div className='space-y-4 px-6 py-4'>
						{usuario && (
							<div className='flex items-center gap-3 pb-2'>
								<InicialesUsuario nombre={usuario.nombre} />
								<div>
									<p className='text-sm font-semibold'>{usuario.nombre}</p>
									<p className='text-xs text-muted-foreground'>{usuario.rut}</p>
								</div>
							</div>
						)}

						<Card className='border-border bg-card shadow-none'>
							<CardHeader className='pb-2 pt-3'>
								<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
									Información general
								</CardTitle>
							</CardHeader>
							<CardContent className='grid gap-3 pb-4 sm:grid-cols-2'>
								<Campo label='Nombre'>
									<Input
										name='nombre'
										value={formik.values.nombre}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										disabled={!puedeEditar}
										className='h-9 text-sm shadow-none'
									/>
									{formik.touched.nombre && formik.errors.nombre && (
										<p className='text-[10px] text-destructive'>
											{formik.errors.nombre}
										</p>
									)}
								</Campo>
								<Campo label='RUT'>
									<Input
										name='rut'
										value={formik.values.rut}
										disabled
										className='h-9 text-sm shadow-none'
									/>
								</Campo>
								<Campo label='Correo'>
									<Input
										name='correo'
										type='email'
										value={formik.values.correo}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										disabled={!puedeEditar}
										className='h-9 text-sm shadow-none'
									/>
									{formik.touched.correo && formik.errors.correo && (
										<p className='text-[10px] text-destructive'>
											{formik.errors.correo}
										</p>
									)}
								</Campo>
								<Campo label='Teléfono'>
									<InputTelefono
										value={formik.values.telefono}
										onChange={v => formik.setFieldValue('telefono', v)}
										disabled={!puedeEditar}
									/>
									{formik.touched.telefono && formik.errors.telefono && (
										<p className='text-[10px] text-destructive'>
											{formik.errors.telefono}
										</p>
									)}
								</Campo>
								<Campo label='Contraseña'>
									<div className='relative'>
										<Input
											name='password'
											type={showPassword ? 'text' : 'password'}
											className='h-9 pr-9 text-sm shadow-none'
											placeholder='••••••••'
											value={formik.values.password}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											disabled={!puedeEditar}
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
									{formik.touched.password && formik.errors.password && (
										<p className='text-[10px] text-destructive'>
											{formik.errors.password}
										</p>
									)}
								</Campo>
								<Campo label='Sucursal' className='sm:col-span-2'>
									<Select
										disabled={!puedeEditar}
										value={
											formik.values.idSucursal != null
												? String(formik.values.idSucursal)
												: ''
										}
										onValueChange={(v: string) =>
											formik.setFieldValue('idSucursal', Number(v))
										}
									>
										<SelectTrigger className='h-9 text-sm shadow-none'>
											<SelectValue placeholder='Seleccionar sucursal' />
										</SelectTrigger>
										<SelectContent>
											{sucursales?.map(s => (
												<SelectItem key={s.id} value={String(s.id)}>
													{s.nombre}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{formik.touched.idSucursal && formik.errors.idSucursal && (
										<p className='text-[10px] text-destructive'>
											{formik.errors.idSucursal}
										</p>
									)}
								</Campo>
							</CardContent>
						</Card>

						<Card className='border-border bg-card shadow-none'>
							<CardHeader className='pb-2 pt-3'>
								<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
									Roles y configuración
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3 pb-4'>
								<div className='space-y-1.5'>
									<Label className='text-xs'>Roles</Label>
									<div className='grid gap-1.5 sm:grid-cols-2'>
										{rolesList.map(rol => (
											<label
												key={rol.codigo}
												className='flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted/40'
											>
												<Checkbox
													checked={formik.values.roles.includes(rol.codigo)}
													onCheckedChange={() => toggleRol(rol.codigo)}
													disabled={!puedeEditar}
												/>
												{rol.nombre}
											</label>
										))}
									</div>
									{formik.touched.roles && formik.errors.roles && (
										<p className='text-[10px] text-destructive'>
											{formik.errors.roles}
										</p>
									)}
								</div>

								<div className='grid gap-4 sm:grid-cols-3'>
									<Campo label='Meta mensual UF'>
										<Input
											name='metaMensualUf'
											type='number'
											min='0'
											placeholder='0'
											value={formik.values.metaMensualUf}
											onChange={formik.handleChange}
											disabled={!puedeEditar}
											className='h-9 text-sm shadow-none'
										/>
									</Campo>
									<Campo label='Comisión %'>
										<Input
											name='porcentajeComision'
											type='number'
											min='0'
											max='100'
											step='0.01'
											placeholder='0'
											value={formik.values.porcentajeComision}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											disabled={!puedeEditar}
											className='h-9 text-sm shadow-none'
										/>
										{formik.touched.porcentajeComision &&
											formik.errors.porcentajeComision && (
												<p className='text-[10px] text-destructive'>
													{formik.errors.porcentajeComision}
												</p>
											)}
									</Campo>
									<div className='flex items-end pb-2.5'></div>
								</div>

								<div className='flex items-center gap-2'>
									<Checkbox
										id='habilitado'
										checked={formik.values.habilitado}
										onCheckedChange={v =>
											formik.setFieldValue('habilitado', v === true)
										}
										disabled={!puedeEditar}
									/>
									<Label
										htmlFor='habilitado'
										className='text-xs cursor-pointer'
									>
										Habilitado
									</Label>
								</div>
							</CardContent>
						</Card>

						{usuario?.fecha_registro && (
							<p className='text-xs text-muted-foreground'>
								Fecha registro: {usuario.fecha_registro}
							</p>
						)}
					</div>

					<div className='flex items-center justify-end gap-2 border-t border-border px-6 py-4'>
						{puedeEditar ? (
							<>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-9 text-xs'
									onClick={() => onOpenChange(false)}
								>
									Cancelar
								</Button>
								<Button type='submit' size='sm' className='h-9 text-xs'>
									Guardar cambios
								</Button>
							</>
						) : (
							<Button
								type='button'
								size='sm'
								className='h-9 text-xs'
								onClick={() => onOpenChange(false)}
							>
								Cerrar
							</Button>
						)}
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
