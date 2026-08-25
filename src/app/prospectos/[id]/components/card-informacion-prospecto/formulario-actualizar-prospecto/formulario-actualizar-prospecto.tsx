import { Button } from '@/components/button'
import { CardContent } from '@/components/card'
import Campo from '@/components/forms/campo/campo'
import FormError from '@/components/forms/form-error/form-error'
import Input from '@/components/forms/input/input'
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
import { formatRut } from '@/utils/format-rut'
import { useMemo } from 'react'

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

	const comunasDeRegionSelect = useMemo(
		() => [...obtenerComunasDeRegion(formik.values.region)],
		[formik.values.region],
	)

	return (
		<CardContent className='space-y-4 p-4'>
			<form onSubmit={formik.handleSubmit}>
				<div className='grid gap-4 sm:grid-cols-2'>
				<Campo label='Nombre del prospecto' className='sm:col-span-2'>
					<Input
						name='nombre_riesgo'
						value={formik.values.nombre_riesgo}
						onChange={formik.handleChange}
					/>
					{formik.touched.nombre_riesgo && formik.errors.nombre_riesgo ? (
						<FormError>{formik.errors.nombre_riesgo}</FormError>
					) : null}
				</Campo>
				<Campo label='RUT'>
					<Input
						placeholder='12.345.678-9'
						inputMode='text'
						autoComplete='off'
						maxLength={14}
						name='rut_riesgo'
						value={formik.values.rut_riesgo ?? ''}
						onChange={e =>
							formik.setFieldValue('rut_riesgo', formatRut(e.target.value))
						}
					/>
					{formik.touched.rut_riesgo && formik.errors.rut_riesgo ? (
						<FormError>{formik.errors.rut_riesgo}</FormError>
					) : null}
				</Campo>
				<Campo label='Dirección' className='sm:col-span-2'>
					<Input
						name='direccion'
						value={formik.values.direccion}
						onChange={formik.handleChange}
					/>
				</Campo>
				<Campo label='Región'>
					<Select
						value={formik.values.region || '__none__'}
						onValueChange={value => {
						formik.setFieldValue('region', value)
						formik.setFieldValue('comuna', null)
					}}
					>
						<SelectTrigger>
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
				</Campo>
				<Campo label='Comuna'>
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
							className={
								!formik.values.region
									? 'cursor-not-allowed opacity-70'
									: undefined
							}
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
				</Campo>
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
