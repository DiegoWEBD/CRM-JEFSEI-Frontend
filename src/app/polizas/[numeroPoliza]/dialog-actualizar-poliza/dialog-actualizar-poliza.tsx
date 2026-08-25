'use client'

import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import { Label } from '@/components/label'
import Input from '@/components/forms/input/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import Poliza from '@/dominio/poliza/poliza'
import { useCompaniesSeguros } from '@/hooks/companies-seguros/use-companies-seguros'
import { useFormularioActualizarPoliza } from '@/hooks/polizas/use-formulario-actualizar-poliza'
import { Loader2 } from 'lucide-react'

type DialogActualizarPolizaProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	poliza: Poliza
}

export default function DialogActualizarPoliza({
	open,
	onOpenChange,
	poliza,
}: DialogActualizarPolizaProps) {
	const { data: companies, isLoading: cargandoCompanies } =
		useCompaniesSeguros()

	const { formik, cargando } = useFormularioActualizarPoliza({
		poliza,
		onComplete: () => onOpenChange(false),
	})

	function handleOpenChange(open: boolean) {
		if (!open) {
			formik.resetForm()
		}
		onOpenChange(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-lg'>
				<DialogHeader>
					<DialogTitle>Editar póliza {poliza.numero_poliza}</DialogTitle>
				</DialogHeader>

				<form
					id='form-actualizar-poliza'
					onSubmit={formik.handleSubmit}
					className='space-y-4'
				>
					<div className='space-y-1.5'>
						<Label className='text-xs'>Tipo</Label>
						<Select
							value={formik.values.tipo}
							onValueChange={v => formik.setFieldValue('tipo', v)}
						>
							<SelectTrigger className='h-9 text-sm shadow-none'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='nueva' className='text-xs'>
									Nueva
								</SelectItem>
								<SelectItem value='renovacion' className='text-xs'>
									Renovación
								</SelectItem>
							</SelectContent>
						</Select>
						{formik.touched.tipo && formik.errors.tipo && (
							<p className='text-xs text-destructive'>{formik.errors.tipo}</p>
						)}
					</div>

					<div className='space-y-1.5'>
						<Label className='text-xs'>Compañía aseguradora</Label>
						<Select
							value={
								formik.values.id_company ? String(formik.values.id_company) : ''
							}
							onValueChange={v => formik.setFieldValue('id_company', Number(v))}
							disabled={cargandoCompanies}
						>
							<SelectTrigger className='h-9 text-sm shadow-none'>
								<SelectValue placeholder='Seleccionar compañía' />
							</SelectTrigger>
							<SelectContent>
								{companies?.map(c => (
									<SelectItem
										key={c.id}
										value={String(c.id)}
										className='text-xs'
									>
										{c.nombre}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{formik.touched.id_company && formik.errors.id_company && (
							<p className='text-xs text-destructive'>
								{formik.errors.id_company}
							</p>
						)}
					</div>

					<div className='grid gap-3 sm:grid-cols-2'>
						<div className='space-y-1.5'>
							<Label className='text-xs'>Prima neta</Label>
							<Input
								className='h-9 text-sm shadow-none'
								type='number'
								inputMode='decimal'
								{...formik.getFieldProps('prima_neta')}
								placeholder='0'
							/>
							{formik.touched.prima_neta && formik.errors.prima_neta && (
								<p className='text-xs text-destructive'>
									{formik.errors.prima_neta}
								</p>
							)}
						</div>
						<div className='space-y-1.5'>
							<Label className='text-xs'>% Comisión corredora</Label>
							<Input
								className='h-9 text-sm shadow-none'
								type='number'
								inputMode='decimal'
								{...formik.getFieldProps('comision_corredora_pct')}
								placeholder='0'
							/>
							{formik.touched.comision_corredora_pct &&
								formik.errors.comision_corredora_pct && (
									<p className='text-xs text-destructive'>
										{formik.errors.comision_corredora_pct}
									</p>
								)}
						</div>
					</div>

					<div className='space-y-1.5'>
						<Label className='text-xs'>Fecha de emisión</Label>
						<Input
							className='h-9 text-sm shadow-none'
							type='date'
							{...formik.getFieldProps('fecha_emision')}
						/>
						{formik.touched.fecha_emision && formik.errors.fecha_emision && (
							<p className='text-xs text-destructive'>
								{formik.errors.fecha_emision}
							</p>
						)}
					</div>

					<div className='grid gap-3 sm:grid-cols-2'>
						<div className='space-y-1.5'>
							<Label className='text-xs'>Inicio de vigencia</Label>
							<Input
								className='h-9 text-sm shadow-none'
								type='date'
								{...formik.getFieldProps('inicio_vigencia')}
							/>
							{formik.touched.inicio_vigencia &&
								formik.errors.inicio_vigencia && (
									<p className='text-xs text-destructive'>
										{formik.errors.inicio_vigencia}
									</p>
								)}
						</div>
						<div className='space-y-1.5'>
							<Label className='text-xs'>Término de vigencia</Label>
							<Input
								className='h-9 text-sm shadow-none'
								type='date'
								{...formik.getFieldProps('fin_vigencia')}
							/>
							{formik.touched.fin_vigencia && formik.errors.fin_vigencia && (
								<p className='text-xs text-destructive'>
									{formik.errors.fin_vigencia}
								</p>
							)}
						</div>
					</div>
				</form>

				{formik.status && (
					<p className='text-xs font-medium text-destructive' role='alert'>
						{formik.status}
					</p>
				)}

				<DialogFooter className='gap-2'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() => handleOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						type='submit'
						form='form-actualizar-poliza'
						size='sm'
						disabled={cargando}
					>
						{cargando && (
							<Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
						)}
						{cargando ? 'Guardando...' : 'Guardar cambios'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
