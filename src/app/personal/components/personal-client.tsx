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
import { classInputRut } from '@/utils/class-input-rut'
import { formatRut } from '@/utils/format-rut'
import {
	rutChilenoEstadoValidacion,
	rutChilenoEsValido,
} from '@/utils/validar-rut'
import { useState, useMemo, useCallback } from 'react'
import {
	Search,
	UserPlus,
	ExternalLink,
	Mail,
	Phone,
	Building2,
} from 'lucide-react'

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
}: {
	usuario: Usuario
	onVerDetalle: (usuario: Usuario) => void
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

	const [usuarioDetalle, setUsuarioDetalle] = useState<Usuario | null>(null)
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

				<Button
					size='sm'
					className='h-9 text-xs'
					onClick={() => setRegistrarAbierto(true)}
				>
					<UserPlus className='mr-1.5 size-3.5' />
					Registrar usuario
				</Button>
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
												{usuario.habilitado
													? 'Habilitado'
													: 'Deshabilitado'}
											</Badge>
										</TableCell>
										<TableCell className='text-right'>
											<Button
												size='sm'
												variant='outline'
												className='h-7 text-[10px]'
												onClick={() => setUsuarioDetalle(usuario)}
											>
												Ver detalle
											</Button>
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
				onOpenChange={open => { if (!open) setUsuarioDetalle(null) }}
				rolesList={rolesList}
			/>

			<DialogRegistrarUsuario
				abierto={registrarAbierto}
				onOpenChange={setRegistrarAbierto}
				rolesList={rolesList}
			/>
		</div>
	)
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

	const [rut, setRut] = useState('')
	const [nombre, setNombre] = useState('')
	const [correo, setCorreo] = useState('')
	const [telefono, setTelefono] = useState('')
	const [idSucursal, setIdSucursal] = useState<number | null>(null)
	const [password, setPassword] = useState('')
	const [roles, setRoles] = useState<string[]>([])
	const [metaMensualUf, setMetaMensualUf] = useState<string>('')
	const [porcentajeComision, setPorcentajeComision] = useState<string>('')
	const [junior, setJunior] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const estadoRut = useMemo(() => rutChilenoEstadoValidacion(rut), [rut])

	const resetForm = useCallback(() => {
		setRut('')
		setNombre('')
		setCorreo('')
		setTelefono('')
		setIdSucursal(null)
		setPassword('')
		setRoles([])
		setMetaMensualUf('')
		setPorcentajeComision('')
		setJunior(false)
		setError(null)
	}, [])

	const handleSubmit = async () => {
		if (!nombre.trim() || !rut.trim() || !password.trim() || idSucursal == null || roles.length === 0) {
			setError('Completa los campos obligatorios: Nombre, RUT, Contraseña, Sucursal y al menos un rol.')
			return
		}
		if (estadoRut !== 'valido') {
			setError('El RUT ingresado no es válido.')
			return
		}

		setError(null)

		const request: RegistrarUsuarioRequest = {
			rut: rut.replace(/[^0-9kK]/g, '').toUpperCase(),
			nombre: nombre.trim(),
			correo: correo.trim() || null,
			telefono: telefono.trim() || null,
			id_sucursal: idSucursal,
			password,
			codigo_roles: roles,
			meta_mensual_uf: metaMensualUf.trim() ? Number(metaMensualUf.trim()) : null,
			porcentaje_comision: porcentajeComision.trim() ? Number(porcentajeComision.trim()) : null,
			junior,
		}

		try {
			await mutation.mutateAsync(request)
			resetForm()
			onOpenChange(false)
		} catch {
			setError('Error al registrar usuario. Intenta nuevamente.')
		}
	}

	const toggleRol = (codigo: string) => {
		setRoles(prev =>
			prev.includes(codigo)
				? prev.filter(r => r !== codigo)
				: [...prev, codigo],
		)
	}

	const handleOpenChange = (open: boolean) => {
		if (!open) resetForm()
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

				<div className='space-y-4 px-6 py-4'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-1.5'>
							<Label htmlFor='rut'>RUT *</Label>
							<Input
								id='rut'
								placeholder='12.345.678-9'
								className={classInputRut(estadoRut)}
								value={rut}
								onChange={e => setRut(formatRut(e.target.value))}
								maxLength={14}
							/>
							{estadoRut === 'formato_invalido' || estadoRut === 'dv_invalido' ? (
								<p className='text-[10px] text-destructive'>
									{estadoRut === 'dv_invalido'
										? 'El dígito verificador no corresponde.'
										: 'Ingrese 8 números y el dígito verificador (0-9 o K).'}
								</p>
							) : estadoRut === 'incompleto' ? (
								<p className='text-[10px] text-muted-foreground'>
									8 dígitos + verificador (número o K).
								</p>
							) : null}
						</div>
						<div className='space-y-1.5'>
							<Label htmlFor='nombre'>Nombre *</Label>
							<Input id='nombre' placeholder='Nombre completo' value={nombre} onChange={e => setNombre(e.target.value)} />
						</div>
						<div className='space-y-1.5'>
							<Label htmlFor='correo'>Correo</Label>
							<Input id='correo' type='email' placeholder='correo@ejemplo.cl' value={correo} onChange={e => setCorreo(e.target.value)} />
						</div>
						<div className='space-y-1.5'>
							<Label htmlFor='telefono'>Teléfono</Label>
							<Input id='telefono' placeholder='+56 9 1234 5678' value={telefono} onChange={e => setTelefono(e.target.value)} />
						</div>
						<div className='space-y-1.5'>
							<Label htmlFor='sucursal'>Sucursal *</Label>
							<Select
								value={idSucursal != null ? String(idSucursal) : ''}
								onValueChange={(v: string) => setIdSucursal(Number(v))}
							>
								<SelectTrigger id='sucursal' className='h-9 text-sm shadow-none'>
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
						</div>
						<div className='space-y-1.5'>
							<Label htmlFor='password'>Contraseña *</Label>
							<Input id='password' type='password' placeholder='••••••••' value={password} onChange={e => setPassword(e.target.value)} />
						</div>
					</div>

					<div className='space-y-1.5'>
						<Label>Roles</Label>
						<div className='grid gap-1.5 sm:grid-cols-2'>
							{rolesList.map(rol => (
								<label
									key={rol.codigo}
									className='flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted/40'
								>
									<Checkbox
										checked={roles.includes(rol.codigo)}
										onCheckedChange={() => toggleRol(rol.codigo)}
									/>
									{rol.nombre}
								</label>
							))}
						</div>
					</div>

					<div className='grid gap-4 sm:grid-cols-3'>
						<div className='space-y-1.5'>
							<Label htmlFor='metaMensual'>Meta mensual UF</Label>
							<Input id='metaMensual' type='number' min='0' placeholder='0' value={metaMensualUf} onChange={e => setMetaMensualUf(e.target.value)} />
						</div>
						<div className='space-y-1.5'>
							<Label htmlFor='comision'>Comisión %</Label>
							<Input id='comision' type='number' min='0' step='0.01' placeholder='0' value={porcentajeComision} onChange={e => setPorcentajeComision(e.target.value)} />
						</div>
						<div className='flex items-end pb-2.5'>
							<label className='flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted/40'>
								<Checkbox
									checked={junior}
									onCheckedChange={v => setJunior(v === true)}
								/>
								Junior
							</label>
						</div>
					</div>

					{error && (
						<p className='text-xs text-destructive'>{error}</p>
					)}
				</div>

				<div className='flex items-center justify-end gap-2 border-t border-border px-6 py-4'>
					<Button
						variant='outline'
						size='sm'
						className='h-9 text-xs'
						onClick={() => handleOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						size='sm'
						className='h-9 text-xs'
						onClick={handleSubmit}
						disabled={mutation.isPending}
					>
						{mutation.isPending ? 'Registrando...' : 'Registrar'}
					</Button>
				</div>
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
	metaMensualUf: string
	porcentajeComision: string
	junior: boolean
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

	const validationSchema = Yup.object({
		nombre: Yup.string().required('El nombre es obligatorio'),
		correo: Yup.string().email('Correo inválido').nullable(),
	})

	const formik = useFormik<EditarUsuarioFormValues>({
		enableReinitialize: true,
		initialValues: {
			nombre: usuario?.nombre ?? '',
			rut: usuario?.rut ?? '',
			correo: usuario?.correo ?? '',
			telefono: usuario?.telefono ?? '',
			idSucursal: (() => {
				if (!usuario?.sucursal) return null
				const found = sucursales?.find(s => s.nombre === usuario.sucursal)
				return found?.id ?? null
			})(),
			roles: usuario?.roles.map(r => r.codigo) ?? [],
			metaMensualUf: usuario?.meta_mensual_uf != null ? String(usuario.meta_mensual_uf) : '',
			porcentajeComision: usuario?.porcentaje_comision != null ? String(usuario.porcentaje_comision) : '',
			junior: usuario?.junior ?? false,
			habilitado: usuario?.habilitado ?? true,
		},
		validationSchema,
		onSubmit: values => {
			if (values.roles.length === 0) return
			mutation.mutate({
				rut: values.rut,
				nombre: values.nombre,
				correo: values.correo || null,
				telefono: values.telefono || null,
				id_sucursal: values.idSucursal!,
				meta_mensual_uf: values.metaMensualUf ? Number(values.metaMensualUf) : null,
				codigo_roles: values.roles,
				porcentaje_comision: values.porcentajeComision ? Number(values.porcentajeComision) : null,
				junior: values.junior,
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
						{puedeEditar ? 'Modifica los datos del usuario.' : 'Información del usuario.'}
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
										<p className='text-[10px] text-destructive'>{formik.errors.nombre}</p>
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
										<p className='text-[10px] text-destructive'>{formik.errors.correo}</p>
									)}
								</Campo>
							<Campo label='Teléfono'>
								<Input
									name='telefono'
									value={formik.values.telefono}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!puedeEditar}
									className='h-9 text-sm shadow-none'
								/>
								</Campo>
							<Campo label='Sucursal' className='sm:col-span-2'>
								<Select
									disabled={!puedeEditar}
									value={formik.values.idSucursal != null ? String(formik.values.idSucursal) : ''}
									onValueChange={(v: string) => formik.setFieldValue('idSucursal', Number(v))}
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
									step='0.01'
									placeholder='0'
									value={formik.values.porcentajeComision}
									onChange={formik.handleChange}
									disabled={!puedeEditar}
									className='h-9 text-sm shadow-none'
								/>
									</Campo>
									<div className='flex items-end pb-2.5'>
										<label className='flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted/40'>
										<Checkbox
											checked={formik.values.junior}
											onCheckedChange={v => formik.setFieldValue('junior', v === true)}
											disabled={!puedeEditar}
										/>
											Junior
										</label>
									</div>
								</div>

								<div className='flex items-center gap-2'>
								<Checkbox
									id='habilitado'
									checked={formik.values.habilitado}
									onCheckedChange={v => formik.setFieldValue('habilitado', v === true)}
									disabled={!puedeEditar}
								/>
									<Label htmlFor='habilitado' className='text-xs cursor-pointer'>
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
							<Button
								type='submit'
								size='sm'
								className='h-9 text-xs'
							>
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
