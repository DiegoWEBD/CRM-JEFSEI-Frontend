import { ActualizarProspectoEmpresaRequest } from '@/aplicacion/prospectos/use-cases/actualizar-prospecto-empresa/dto/requests/actualizar-prospecto-empresa-request'
import { Button } from '@/components/button/button'
import Campo from '@/components/forms/campo/campo'
import FormError from '@/components/forms/form-error/form-error'
import Input from '@/components/forms/input/input'
import { FormikProps } from 'formik'
import { Plus, Trash2 } from 'lucide-react'

type CamposAdicionalesProspectoEmpresaProps = {
	formik: FormikProps<ActualizarProspectoEmpresaRequest>
}

export default function CamposAdicionalesProspectoEmpresa({
	formik,
}: CamposAdicionalesProspectoEmpresaProps) {
	const giros: string[] = formik.values.giros_comerciales ?? []

	const cambiarGiro = (indice: number, valor: string) => {
		const nuevos = [...giros]
		nuevos[indice] = valor
		formik.setFieldValue('giros_comerciales', nuevos)
	}

	const agregarGiro = () => {
		formik.setFieldValue('giros_comerciales', [...giros, ''])
	}

	const eliminarGiro = (indice: number) => {
		formik.setFieldValue(
			'giros_comerciales',
			giros.filter((_, i) => i !== indice),
		)
	}

	return (
		<>
			<Campo label='Nombre de fantasía'>
				<Input
					name='nombre_fantasia'
					value={formik.values.nombre_fantasia ?? ''}
					onChange={formik.handleChange}
				/>
			</Campo>

			<Campo label='Cantidad de trabajadores'>
				<Input
					type='number'
					min={0}
					name='cantidad_trabajadores'
					value={formik.values.cantidad_trabajadores ?? ''}
					onChange={e =>
						formik.setFieldValue(
							'cantidad_trabajadores',
							e.target.value === '' ? undefined : Number(e.target.value),
						)
					}
				/>
				{formik.touched.cantidad_trabajadores &&
				formik.errors.cantidad_trabajadores ? (
					<FormError>{formik.errors.cantidad_trabajadores}</FormError>
				) : null}
			</Campo>

			<div className='space-y-2 sm:col-span-2'>
				<div className='flex items-center justify-between'>
					<span className='text-xs font-medium text-muted-foreground'>
						Giros comerciales
					</span>
					<Button
						type='button'
						size='sm'
						variant='outline'
						className='h-8 text-xs'
						onClick={agregarGiro}
					>
						<Plus className='mr-1 h-3.5 w-3.5' aria-hidden />
						Agregar giro
					</Button>
				</div>

				{giros.length === 0 && (
					<p className='text-xs text-muted-foreground'>
						Sin giros comerciales registrados.
					</p>
				)}

				{giros.map((giro, indice) => (
					<div key={indice} className='flex items-center gap-2'>
						<Input
							placeholder='Ej: Comercio al por menor'
							value={giro}
							onChange={e => cambiarGiro(indice, e.target.value)}
						/>
						<Button
							type='button'
							size='sm'
							variant='outline'
							className='h-8 w-8 shrink-0 p-0'
							onClick={() => eliminarGiro(indice)}
						>
							<Trash2 className='h-3.5 w-3.5' aria-hidden />
						</Button>
					</div>
				))}
			</div>
		</>
	)
}
