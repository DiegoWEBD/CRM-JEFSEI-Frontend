'use client'

import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { SelectorAdministrador } from '@/components/selector-administrador'
import { Textarea } from '@/components/textarea'
import { useAdministradores } from '@/hooks/administradores/use-administradores'
import { useFormularioRegistrarProspecto } from '@/hooks/prospectos/use-formulario-registrar-prospecto'
import {
	CHILE_REGIONES_NOMBRES,
	obtenerComunasDeRegion,
} from '@/lib/chile-regiones-comunas'
import { classInputRut } from '@/utils/class-input-rut'
import { inp } from '@/utils/form-utils'
import { rutChilenoEstadoValidacion } from '@/utils/validar-rut'
import { Building2, LoaderCircle, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import CamposCondominioRegistrar from './campos-condominio-registrar/campos-condominio-registrar'

type FormularioRegistrarProspectoProps = {
	onProspectoRegistrado?: () => void
	onClose?: () => void
}

type TipoCliente = 'condominio' | 'linea_personal'

export default function FormularioRegistrarProspecto({
	onProspectoRegistrado,
	onClose,
}: FormularioRegistrarProspectoProps) {
	const { formik, cargando } = useFormularioRegistrarProspecto({
		onProspectoRegistrado,
		onClose,
	})

	const { data: administradores } = useAdministradores()

	const [region, setRegion] = useState(formik.values.region ?? '')
	const comunasDeRegion = useMemo(
		() => [...obtenerComunasDeRegion(region)],
		[region],
	)

	const tipoActual: TipoCliente =
		formik.values.linea_negocio === 'condominio'
			? 'condominio'
			: 'linea_personal'

	const setTipo = (tipo: TipoCliente) => {
		formik.setFieldValue(
			'linea_negocio',
			tipo === 'condominio' ? 'condominio' : 'lineas_personales',
		)
	}

	const estadoRut = useMemo(
		() => rutChilenoEstadoValidacion(formik.values.rut_riesgo ?? ''),
		[formik.values.rut_riesgo],
	)

	return (
		<form onSubmit={formik.handleSubmit} className='space-y-6'>
			<Card className='border-border bg-card shadow-none'>
				<CardHeader className='pb-2 pt-3'>
					<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
						Tipo de cliente
					</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-wrap gap-2 pb-4'>
					<Button
						type='button'
						size='sm'
						variant={tipoActual === 'condominio' ? 'default' : 'outline'}
						className='h-9 text-xs'
						onClick={() => setTipo('condominio')}
					>
						<Building2 className='mr-1.5 h-3.5 w-3.5' aria-hidden />
						Condominio
					</Button>
					<Button
						type='button'
						size='sm'
						variant={tipoActual === 'linea_personal' ? 'default' : 'outline'}
						className='h-9 text-xs'
						onClick={() => setTipo('linea_personal')}
					>
						<User className='mr-1.5 h-3.5 w-3.5' aria-hidden />
						Línea personal / Persona natural
					</Button>
				</CardContent>
			</Card>

			<Card className='border-border bg-card shadow-none'>
				<CardHeader className='pb-2 pt-3'>
					<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
						Datos generales
					</CardTitle>
				</CardHeader>
				<CardContent className='grid gap-3 pb-4 sm:grid-cols-2'>
					<div className='space-y-1.5'>
						<label
							className={`text-xs${estadoRut === 'vacio' || estadoRut === 'incompleto' ? ' text-warning' : ''}${estadoRut === 'formato_invalido' || estadoRut === 'dv_invalido' ? ' text-destructive' : ''}`}
						>
							RUT
						</label>
						<Input
							className={classInputRut(estadoRut)}
							placeholder='12.345.678-9'
							inputMode='text'
							autoComplete='off'
							maxLength={14}
							name='rut_riesgo'
							value={formik.values.rut_riesgo ?? ''}
							onChange={formik.handleChange}
						/>
						{estadoRut === 'formato_invalido' || estadoRut === 'dv_invalido' ? (
							<p className='text-xs text-destructive'>
								{estadoRut === 'dv_invalido'
									? 'El dígito verificador no corresponde.'
									: 'Ingrese 8 números y el dígito verificador (0-9 o K).'}
							</p>
						) : estadoRut === 'incompleto' ? (
							<p className='text-xs text-muted-foreground'>
								8 dígitos + verificador (número o K).
							</p>
						) : null}
					</div>

					<div className='space-y-1.5'>
						<label
							className={`text-xs${formik.values.nombre_riesgo ? '' : ' text-warning'}`}
						>
							Nombre / Razón social *
						</label>
						<Input
							className={inp(!formik.values.nombre_riesgo)}
							name='nombre_riesgo'
							value={formik.values.nombre_riesgo}
							onChange={formik.handleChange}
						/>
						{formik.touched.nombre_riesgo && formik.errors.nombre_riesgo ? (
							<p className='text-xs text-destructive'>
								{formik.errors.nombre_riesgo}
							</p>
						) : null}
					</div>

					<div className='space-y-1.5 sm:col-span-2'>
						<label
							className={`text-xs${inputPendienteSimple(formik.values.direccion) ? ' text-warning' : ''}`}
						>
							Dirección
						</label>
						<Input
							className={inp(inputPendienteSimple(formik.values.direccion))}
							name='direccion'
							value={formik.values.direccion}
							onChange={formik.handleChange}
						/>
					</div>

					<div className='space-y-1.5'>
						<label
							className={`text-xs${inputPendienteSimple(region) ? ' text-warning' : ''}`}
						>
							Región
						</label>
						<Select
							value={region || '__none__'}
							onValueChange={value => {
								const r = value === '__none__' ? '' : value
								setRegion(r)
								formik.setFieldValue('region', r)
								if (
									r &&
									!comunasDeRegion.includes(formik.values.comuna ?? '')
								) {
									formik.setFieldValue('comuna', '')
								}
							}}
						>
							<SelectTrigger className={inp(inputPendienteSimple(region))}>
								<SelectValue placeholder='Selecciona una región' />
							</SelectTrigger>
							<SelectContent className='max-h-70'>
								<SelectItem
									value='__none__'
									className='text-xs text-muted-foreground'
								>
									Selecciona una región
								</SelectItem>
								{CHILE_REGIONES_NOMBRES.map(r => (
									<SelectItem key={r} value={r} className='text-xs'>
										{r}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-1.5'>
						<label
							className={`text-xs${inputPendienteSimple(formik.values.comuna) ? ' text-warning' : ''}`}
						>
							Comuna
						</label>
						<Select
							disabled={!region}
							value={
								formik.values.comuna &&
								comunasDeRegion.includes(formik.values.comuna)
									? formik.values.comuna
									: '__none__'
							}
							onValueChange={value => {
								const c = value === '__none__' ? '' : value
								formik.setFieldValue('comuna', c)
							}}
						>
							<SelectTrigger
								className={`${inp(inputPendienteSimple(formik.values.comuna))}${!region ? ' cursor-not-allowed opacity-70' : ''}`}
							>
								<SelectValue
									placeholder={
										region
											? 'Selecciona una comuna'
											: 'Primero selecciona una región'
									}
								/>
							</SelectTrigger>
							<SelectContent className='max-h-70'>
								<SelectItem
									value='__none__'
									className='text-xs text-muted-foreground'
								>
									{region
										? 'Selecciona una comuna'
										: 'Primero selecciona una región'}
								</SelectItem>
								{comunasDeRegion.map(c => (
									<SelectItem key={c} value={c} className='text-xs'>
										{c}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{tipoActual === 'condominio' && (
						<div className='space-y-1.5'>
							<label className='text-xs'>Administrador</label>
							<SelectorAdministrador
								value={formik.values.id_administrador}
								onChange={id => formik.setFieldValue('id_administrador', id)}
								administradores={administradores ?? []}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{tipoActual === 'condominio' && (
				<>
					<Card className='border-border bg-card shadow-none'>
						<CardHeader className='pb-2 pt-3'>
							<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
								Características de construcción
							</CardTitle>
						</CardHeader>
						<CardContent className='grid gap-3 pb-4 sm:grid-cols-2'>
							<CamposCondominioRegistrar
								formik={formik}
								section='construccion'
							/>
						</CardContent>
					</Card>

					<Card className='border-border bg-card shadow-none'>
						<CardHeader className='pb-2 pt-3'>
							<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
								Información para evaluación del seguro
							</CardTitle>
						</CardHeader>
						<CardContent className='grid gap-3 pb-4 sm:grid-cols-2'>
							<CamposCondominioRegistrar formik={formik} section='evaluacion' />
						</CardContent>
					</Card>

					<Card className='border-border bg-card shadow-none'>
						<CardHeader className='pb-2 pt-3'>
							<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
								Medidas de seguridad
							</CardTitle>
						</CardHeader>
						<CardContent className='grid gap-3 pb-4 sm:grid-cols-2'>
							<CamposCondominioRegistrar formik={formik} section='seguridad' />
						</CardContent>
					</Card>
				</>
			)}

			<Card className='border-border bg-card shadow-none'>
				<CardHeader className='pb-2 pt-3'>
					<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
						Observaciones comerciales
					</CardTitle>
				</CardHeader>
				<CardContent className='pb-4'>
					<Textarea
						className='min-h-30 resize-y text-sm leading-relaxed shadow-none'
						placeholder='Agrega un comentario...'
						name='observaciones'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.observaciones}
					/>
				</CardContent>
			</Card>

			<div className='flex flex-wrap justify-end gap-2 border-t border-border pt-2'>
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-9 text-xs'
					onClick={onClose}
				>
					Cancelar
				</Button>
				<Button
					type='submit'
					size='sm'
					className='h-9 text-xs'
					disabled={cargando}
				>
					{cargando && (
						<LoaderCircle className='mr-1.5 h-3.5 w-3.5 animate-spin' />
					)}
					{cargando ? 'Registrando...' : 'Guardar cliente'}
				</Button>
			</div>
		</form>
	)
}

function inputPendienteSimple(input?: string | number | boolean | null) {
	if (input === undefined || input === null) return true
	if (typeof input === 'boolean' || typeof input === 'number') return false
	return !String(input).trim()
}
