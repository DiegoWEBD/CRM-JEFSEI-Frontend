'use client'

import { Button } from '@/components/button'
import { Input } from '@/components/input'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { useActualizarFechaEstimadaCierre } from '@/hooks/procesos-comerciales/use-actualizar-fecha-estimada-cierre'
import { useUserSession } from '@/hooks/auth/use-user-session'
import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { formatFechaCorta } from '@/utils/format-fecha-corta'
import { useFormik } from 'formik'
import { CalendarDays, Check, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import * as Yup from 'yup'

type FechaEstimadaCierreCellProps = {
	proceso: ProcesoComercial
	idProspecto: number
	ejecutivoComercialRut?: string
}

const validacionFechaEstimadaCierre = Yup.object({
	fecha: Yup.string(),
})

export default function FechaEstimadaCierreCell({
	proceso,
	idProspecto,
	ejecutivoComercialRut,
}: FechaEstimadaCierreCellProps) {
	const { usuario } = useUserSession()
	const [editando, setEditando] = useState(false)
	const actualizarFecha = useActualizarFechaEstimadaCierre(idProspecto)

	const puedeEditar =
		!proceso.cerrado && usuario?.rut === ejecutivoComercialRut

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			fecha: proceso.fecha_estimada_cierre?.slice(0, 10) ?? '',
		},
		validationSchema: validacionFechaEstimadaCierre,
		onSubmit: async (values, helpers) => {
			await actualizarFecha.mutateAsync({
				idProceso: proceso.id,
				request: {
					fecha_estimada_cierre: values.fecha
						? values.fecha
						: null,
				},
			})
			setEditando(false)
			helpers.resetForm()
		},
	})

	function cancelarEdicion() {
		setEditando(false)
		formik.resetForm()
	}

	return (
		<div className='flex flex-wrap items-center justify-between gap-2'>
			<div className='min-w-0'>
				<p className='text-xs text-muted-foreground'>
					Fecha estimada de cierre
				</p>
				{editando ? (
					<form
						onSubmit={formik.handleSubmit}
						className='mt-1 flex items-center gap-2'
					>
						<Input
							type='date'
							name='fecha'
							value={formik.values.fecha}
							onChange={formik.handleChange}
							className='h-8 w-36 text-xs'
						/>
						<Button
							type='submit'
							size='sm'
							className='h-8 gap-1 text-xs shadow-none'
							disabled={actualizarFecha.isPending}
						>
							{actualizarFecha.isPending ? (
								<Loader2
									className='h-3.5 w-3.5 animate-spin'
									aria-hidden
								/>
							) : (
								<Check className='h-3.5 w-3.5' aria-hidden />
							)}
							Guardar
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-8 gap-1 text-xs shadow-none'
							onClick={cancelarEdicion}
							disabled={actualizarFecha.isPending}
						>
							<X className='h-3.5 w-3.5' aria-hidden />
							Cancelar
						</Button>
					</form>
				) : (
					<p className='text-sm font-medium text-foreground'>
						{proceso.fecha_estimada_cierre
							? formatFechaCorta(proceso.fecha_estimada_cierre)
							: '—'}
					</p>
				)}
			</div>

			{!editando && puedeEditar ? (
				<PermissionGuard
					allowedPermissions={[
						'ADMINISTRAR_PROCESOS_COMERCIALES_PROPIOS',
					]}
					fallback={null}
				>
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='h-7 gap-1 text-xs shadow-none'
						onClick={() => setEditando(true)}
					>
						<CalendarDays className='h-3 w-3' aria-hidden />
						{proceso.fecha_estimada_cierre
							? 'Editar'
							: 'Establecer'}
					</Button>
				</PermissionGuard>
			) : null}
		</div>
	)
}
