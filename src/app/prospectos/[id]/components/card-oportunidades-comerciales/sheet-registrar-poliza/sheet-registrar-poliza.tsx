'use client'

import { Button } from '@/components/button'
import { Label } from '@/components/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { Input } from '@/components/input'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/sheet'
import { useCompaniesSeguros } from '@/hooks/companies-seguros/use-companies-seguros'
import { useFormularioRegistrarPoliza } from '@/hooks/polizas/use-formulario-registrar-poliza/use-formulario-registrar-poliza'
import { Loader2 } from 'lucide-react'

type SheetRegistrarPolizaProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	idProceso: number
	idProspecto: number
	idCliente?: number
	nombreCliente: string
	producto: string
}

export default function SheetRegistrarPoliza({
	open,
	onOpenChange,
	idProceso,
	idProspecto,
	idCliente,
	nombreCliente,
	producto,
}: SheetRegistrarPolizaProps) {
	const { data: companies, isLoading: cargandoCompanies } =
		useCompaniesSeguros()

	const { formik, cargando } = useFormularioRegistrarPoliza({
		idProceso,
		idProspecto,
		idCliente,
		onClose: () => {
			formik.resetForm()
			onOpenChange(false)
		},
	})

	function handleOpenChange(open: boolean) {
		if (!open) {
			formik.resetForm()
		}
		onOpenChange(open)
	}

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent className='flex w-full flex-col sm:max-w-md overflow-hidden'>
				<SheetHeader className='border-b border-border px-4 py-3'>
					<SheetTitle className='text-sm font-semibold'>
						Subir póliza
					</SheetTitle>
				</SheetHeader>

				<form
					id='form-registrar-poliza'
					onSubmit={formik.handleSubmit}
					className='flex-1 overflow-y-auto px-4 py-3'
				>
					<div className='space-y-4'>
						<p className='text-xs leading-relaxed'>
							<span className='text-muted-foreground'>Cliente: </span>
							<span className='font-medium text-foreground'>
								{nombreCliente || '—'}
							</span>
						</p>
						<p className='text-xs leading-relaxed'>
							<span className='text-muted-foreground'>Oportunidad: </span>
							<span className='font-medium text-foreground'>
								{producto || '—'}
							</span>
						</p>

						<div className='space-y-1.5'>
							<Label className='text-xs'>Compañía aseguradora</Label>
							<Select
								value={
									formik.values.id_company
										? String(formik.values.id_company)
										: ''
								}
								onValueChange={v =>
									formik.setFieldValue('id_company', Number(v))
								}
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
								<p className='text-[10px] text-destructive'>
									{formik.errors.id_company}
								</p>
							)}
						</div>

						<div className='space-y-1.5'>
							<Label className='text-xs'>Número de póliza</Label>
							<Input
								className='h-9 text-sm shadow-none'
								{...formik.getFieldProps('numero_poliza')}
								placeholder='Ej. POL-2026-001'
							/>
							{formik.touched.numero_poliza && formik.errors.numero_poliza && (
								<p className='text-[10px] text-destructive'>
									{formik.errors.numero_poliza}
								</p>
							)}
						</div>

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
								<p className='text-[10px] text-destructive'>
									{formik.errors.tipo}
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
									<p className='text-[10px] text-destructive'>
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
										<p className='text-[10px] text-destructive'>
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
								<p className='text-[10px] text-destructive'>
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
										<p className='text-[10px] text-destructive'>
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
									<p className='text-[10px] text-destructive'>
										{formik.errors.fin_vigencia}
									</p>
								)}
							</div>
						</div>
					</div>
				</form>

				<SheetFooter className='border-t border-border px-4 py-3'>
					<div className='flex w-full flex-col gap-2'>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='w-full text-xs shadow-none'
							disabled={cargando}
							onClick={() => handleOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button
							type='submit'
							form='form-registrar-poliza'
							size='sm'
							className='w-full text-xs shadow-none'
							disabled={cargando}
						>
							{cargando && (
								<Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
							)}
							{cargando ? 'Guardando...' : 'Guardar póliza'}
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
