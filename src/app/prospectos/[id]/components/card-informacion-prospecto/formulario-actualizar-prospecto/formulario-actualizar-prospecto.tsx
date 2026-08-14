import { Button } from '@/components/button'
import { CardContent } from '@/components/card'
import Input from '@/components/forms/input/input'
import Label from '@/components/forms/label/label'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { useFormularioActualizarProspecto } from '@/hooks/prospectos/use-formulario-actualizar-prospecto'
import {
	CHILE_REGIONES_NOMBRES,
	obtenerComunasDeRegion,
} from '@/lib/chile-regiones-comunas'
import { classname } from '@/lib/class-name'
import { classInputRut } from '@/utils/class-input-rut'
import { inputPendiente } from '@/utils/input/input-pendiente'
import {
	rutChilenoEstadoValidacion,
} from '@/utils/validar-rut'
import { useMemo } from 'react'

export function inp(pendiente: boolean, extra?: string) {
	return classname(
		'h-9 text-sm shadow-none',
		pendiente &&
			'border-warning/60 bg-warning/[0.06] dark:bg-warning/10',
		extra,
	)
}

type FormularioActualizarProspectoProps = {
	prospecto: Prospecto
	cancelarEdicionInformacion: () => void
}

export default function FormularioActualizarProspecto({
	prospecto,
	cancelarEdicionInformacion,
}: FormularioActualizarProspectoProps) {
	const { formik } = useFormularioActualizarProspecto({
		prospecto,
		onComplete: cancelarEdicionInformacion,
	})

	const estadoRut = useMemo(
		() => rutChilenoEstadoValidacion(formik.values.rut_riesgo),
		[formik.values.rut_riesgo],
	)

	const comunasDeRegionSelect = useMemo(
		() => [...obtenerComunasDeRegion(formik.values.region)],
		[formik.values.region],
	)

	return (
		<CardContent className='space-y-4 p-4'>
			<form onSubmit={formik.handleSubmit}>
				<div className='grid gap-4 sm:grid-cols-2'>
					<div className='space-y-1.5 sm:col-span-2'>
						<Label
							className={classname(
								'text-xs',
								inputPendiente(formik.values.nombre_riesgo) &&
									'text-warning',
							)}
						>
							Nombre del prospecto
						</Label>
						<Input
							className={inp(inputPendiente(formik.values.nombre_riesgo))}
							name='nombre_riesgo'
							value={formik.values.nombre_riesgo}
							onChange={formik.handleChange}
						/>
					</div>
					<div className='space-y-1.5'>
						<Label
							className={classname(
								'text-xs',
								(estadoRut === 'vacio' || estadoRut === 'incompleto') &&
									'text-warning',
								(estadoRut === 'formato_invalido' ||
									estadoRut === 'dv_invalido') &&
									'text-destructive',
							)}
						>
							RUT
						</Label>
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
					<div className='space-y-1.5 sm:col-span-2'>
						<Label
							className={classname(
								'text-xs',
								inputPendiente(formik.values.direccion) &&
									'text-warning',
							)}
						>
							Dirección
						</Label>
						<Input
							className={inp(inputPendiente(formik.values.direccion))}
							name='direccion'
							value={formik.values.direccion}
							onChange={formik.handleChange}
						/>
					</div>
					<div className='space-y-1.5'>
						<Label
							className={classname(
								'text-xs',
								inputPendiente(formik.values.region) &&
									'text-warning',
							)}
						>
							Región
						</Label>
						<Select
							value={formik.values.region || '__none__'}
							onValueChange={value => formik.setFieldValue('region', value)}
						>
							<SelectTrigger
								className={inp(inputPendiente(formik.values.region))}
							>
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
						<Label
							className={classname(
								'text-xs',
								inputPendiente(formik.values.comuna) &&
									'text-warning',
							)}
						>
							Comuna
						</Label>
						<Select
							disabled={!formik.values.region}
							value={
								formik.values.comuna &&
								comunasDeRegionSelect.includes(formik.values.comuna)
									? formik.values.comuna
									: '__none__'
							}
							onValueChange={value => {
								const comuna = value === '__none__' ? '' : value
								formik.setFieldValue('comuna', comuna)
							}}
						>
							<SelectTrigger
								className={classname(
									inp(inputPendiente(formik.values.comuna)),
									!formik.values.region && 'cursor-not-allowed opacity-70',
								)}
							>
								<SelectValue
									placeholder={
										formik.values.region
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
									{formik.values.region
										? 'Selecciona una comuna'
										: 'Primero selecciona una región'}
								</SelectItem>
								{comunasDeRegionSelect.map(c => (
									<SelectItem key={c} value={c} className='text-xs'>
										{c}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{prospecto.linea_negocio.nombre.toLowerCase() !== 'condominio' && (
						<div className='space-y-1.5'>
							<Label
								className={classname(
									'text-xs',
									inputPendiente(formik.values.telefono_contacto) &&
										'text-warning',
								)}
							>
								Teléfono de contacto
							</Label>
							<Input
								className={inp(inputPendiente(formik.values.telefono_contacto))}
								inputMode='tel'
								name='telefono_contacto'
								value={formik.values.telefono_contacto}
								onChange={formik.handleChange}
							/>
						</div>
					)}
					<div className='space-y-1.5'>
						<Label
							className={classname(
								'text-xs',
								inputPendiente(formik.values.correo_contacto) &&
									'text-warning',
							)}
						>
							Correo prospecto
						</Label>
						<Input
							className={inp(inputPendiente(formik.values.correo_contacto))}
							type='email'
							name='correo_contacto'
							value={formik.values.correo_contacto}
							onChange={formik.handleChange}
						/>
					</div>
				</div>
				<div className='flex flex-wrap justify-end gap-2 border-t mt-6 border-border pt-3'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='h-8 text-xs'
						onClick={cancelarEdicionInformacion}
					>
						Cancelar
					</Button>
					<Button type='submit' size='sm' className='h-8 text-xs'>
						Guardar cambios
					</Button>
				</div>
			</form>
		</CardContent>
	)
}
