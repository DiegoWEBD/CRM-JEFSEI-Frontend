'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useParametrosDepreciacion } from '@/hooks/configuracion-condominio/use-parametros-depreciacion'
import { useGuardarParametrosDepreciacion } from '@/hooks/configuracion-condominio/use-guardar-parametros-depreciacion'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Skeleton } from '@/components/skeleton'
import Campo from '@/components/forms/campo/campo'

type ParametrosFormValues = {
	antiguedadSinDepreciacion: string
	porcentajePorAnio: string
	antiguedadMaxima: string
	porcentajeMaximo: string
}

const validationSchema = Yup.object({
	antiguedadSinDepreciacion: Yup.number()
		.typeError('Debe ser un número')
		.required('Este campo es obligatorio')
		.integer('Debe ser un entero')
		.min(1, 'Debe ser mayor a 0'),
	porcentajePorAnio: Yup.number()
		.typeError('Debe ser un número')
		.required('Este campo es obligatorio')
		.min(0.01, 'Debe ser mayor a 0'),
	antiguedadMaxima: Yup.number()
		.typeError('Debe ser un número')
		.required('Este campo es obligatorio')
		.integer('Debe ser un entero')
		.min(1, 'Debe ser mayor a 0'),
	porcentajeMaximo: Yup.number()
		.typeError('Debe ser un número')
		.required('Este campo es obligatorio')
		.min(0.01, 'Debe ser mayor a 0'),
})

export default function FormularioParametrosDepreciacion() {
	const { data: parametros, isLoading } = useParametrosDepreciacion()
	const guardarMutation = useGuardarParametrosDepreciacion()

	const formik = useFormik<ParametrosFormValues>({
		enableReinitialize: true,
		initialValues: {
			antiguedadSinDepreciacion:
				parametros?.antiguedad_sin_depreciacion?.toString() ?? '',
			porcentajePorAnio: parametros?.porcentaje_por_anio?.toString() ?? '',
			antiguedadMaxima: parametros?.antiguedad_maxima?.toString() ?? '',
			porcentajeMaximo: parametros?.porcentaje_maximo?.toString() ?? '',
		},
		validationSchema,
		onSubmit: () => {
			guardarMutation.mutate({
				id: parametros?.id,
				antiguedad_sin_depreciacion: parseInt(
					formik.values.antiguedadSinDepreciacion,
				),
				porcentaje_por_anio: parseFloat(formik.values.porcentajePorAnio),
				antiguedad_maxima: parseInt(formik.values.antiguedadMaxima),
				porcentaje_maximo: parseFloat(formik.values.porcentajeMaximo),
			})
		},
	})

	if (isLoading) {
		return (
			<Card className='border-border bg-card shadow-none'>
				<CardHeader className='border-b border-border pb-2 pt-3'>
					<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
						Parámetros de Depreciación
					</CardTitle>
				</CardHeader>
				<CardContent className='p-4'>
					<div className='grid gap-4 sm:grid-cols-2'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className='space-y-1.5'>
								<Skeleton className='h-3 w-32 rounded-md' />
								<Skeleton className='h-9 w-full rounded-md' />
								<Skeleton className='h-3 w-48 rounded-md' />
							</div>
						))}
					</div>
					<div className='mt-4'>
						<Skeleton className='h-9 w-44 rounded-md' />
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='border-b border-border pb-2 pt-3'>
				<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
					Parámetros de Depreciación
				</CardTitle>
			</CardHeader>
			<CardContent className='p-4'>
				<form onSubmit={formik.handleSubmit}>
					<div className='grid gap-4 sm:grid-cols-2'>
						<Campo label='Años sin depreciación'>
							<Input
								type='number'
								name='antiguedadSinDepreciacion'
								value={formik.values.antiguedadSinDepreciacion}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className='h-9 text-xs shadow-none'
							/>
							{formik.touched.antiguedadSinDepreciacion &&
								formik.errors.antiguedadSinDepreciacion && (
									<p className='text-xs text-destructive'>
										{formik.errors.antiguedadSinDepreciacion}
									</p>
								)}
							<p className='mt-1 text-xs text-muted-foreground'>
								Condominios con menos de esta antigüedad no tienen depreciación
								(0%)
							</p>
						</Campo>

						<Campo label='Porcentaje por año (%)'>
							<Input
								type='number'
								step='0.01'
								name='porcentajePorAnio'
								value={formik.values.porcentajePorAnio}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className='h-9 text-xs shadow-none'
							/>
							{formik.touched.porcentajePorAnio &&
								formik.errors.porcentajePorAnio && (
									<p className='text-xs text-destructive'>
										{formik.errors.porcentajePorAnio}
									</p>
								)}
							<p className='mt-1 text-xs text-muted-foreground'>
								Porcentaje de depreciación por cada año de antigüedad
							</p>
						</Campo>

						<Campo label='Antigüedad máxima (años)'>
							<Input
								type='number'
								name='antiguedadMaxima'
								value={formik.values.antiguedadMaxima}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className='h-9 text-xs shadow-none'
							/>
							{formik.touched.antiguedadMaxima &&
								formik.errors.antiguedadMaxima && (
									<p className='text-xs text-destructive'>
										{formik.errors.antiguedadMaxima}
									</p>
								)}
							<p className='mt-1 text-xs text-muted-foreground'>
								A partir de esta antigüedad, se aplica el porcentaje máximo
							</p>
						</Campo>

						<Campo label='Porcentaje máximo (%)'>
							<Input
								type='number'
								step='0.01'
								name='porcentajeMaximo'
								value={formik.values.porcentajeMaximo}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className='h-9 text-xs shadow-none'
							/>
							{formik.touched.porcentajeMaximo &&
								formik.errors.porcentajeMaximo && (
									<p className='text-xs text-destructive'>
										{formik.errors.porcentajeMaximo}
									</p>
								)}
							<p className='mt-1 text-xs text-muted-foreground'>
								Porcentaje máximo de depreciación aplicable
							</p>
						</Campo>
					</div>

					<div className='mt-4 rounded-md bg-muted p-3'>
						<h4 className='mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
							Ejemplo de cálculo
						</h4>
						<p className='text-xs text-muted-foreground'>
							Condominio del año 2006 (20 años de antigüedad):
							<br />
							20 años × {formik.values.porcentajePorAnio}% ={' '}
							{20 * parseFloat(formik.values.porcentajePorAnio || '0')}% de
							depreciación
						</p>
					</div>

					<div className='mt-4 border-t border-border pt-4'>
						<Button
							type='submit'
							disabled={guardarMutation.isPending}
							size='sm'
							className='h-9 text-xs shadow-none'
						>
							{guardarMutation.isPending
								? 'Guardando...'
								: 'Guardar parámetros'}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
