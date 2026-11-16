'use client'

import { Button } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import { Skeleton } from '@/components/skeleton'
import Usuario from '@/dominio/usuario/usuario'
import { useObtenerRoles } from '@/hooks/roles/use-obtener-roles'
import { useActualizarRolesUsuario } from '@/hooks/usuarios/use-actualizar-roles-usuario'
import { useFormik } from 'formik'
import * as Yup from 'yup'

type DialogAsignarRolesUsuarioProps = {
	usuario: Usuario | null
	cerrarDialog: () => void
}

export default function DialogAsignarRolesUsuario({
	usuario,
	cerrarDialog,
}: DialogAsignarRolesUsuarioProps) {
	const { data: roles, isFetching } = useObtenerRoles()
	const actualizarRoles = useActualizarRolesUsuario()

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			codigo_roles: usuario ? usuario.roles.map(rol => rol.codigo) : [],
		},
		validationSchema: Yup.object({
			codigo_roles: Yup.array()
				.of(Yup.string())
				.min(1, 'Debe asignar al menos un rol'),
		}),
		onSubmit: values => {
			if (!usuario) return
			actualizarRoles.mutate(
				{ rut: usuario.rut, codigoRoles: values.codigo_roles },
				{ onSuccess: cerrarDialog },
			)
		},
	})

	const alternarRol = (codigo: string) => {
		const actuales = formik.values.codigo_roles
		const nuevos = actuales.includes(codigo)
			? actuales.filter(rol => rol !== codigo)
			: [...actuales, codigo]
		formik.setFieldValue('codigo_roles', nuevos)
	}

	const handleOpenChange = (abierto: boolean) => {
		if (!abierto) {
			formik.resetForm()
			cerrarDialog()
		}
	}

	const errorRoles =
		formik.submitCount > 0 && typeof formik.errors.codigo_roles === 'string'
			? formik.errors.codigo_roles
			: null

	return (
		<Dialog open={usuario !== null} onOpenChange={handleOpenChange}>
			<DialogContent className='max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Asignar roles</DialogTitle>
					<DialogDescription>
						Selecciona los roles de <strong>{usuario?.nombre}</strong> (
						{usuario?.rut}).
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={formik.handleSubmit} className='space-y-4'>
					<div className='grid gap-1.5 sm:grid-cols-2'>
						{isFetching && !roles ? (
							Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className='h-10 w-full rounded-md' />
							))
						) : (
							<>
								{roles?.map(rol => (
									<label
										key={rol.codigo}
										className='flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted/40'
									>
										<Checkbox
											checked={formik.values.codigo_roles.includes(rol.codigo)}
											onCheckedChange={() => alternarRol(rol.codigo)}
										/>
										{rol.nombre}
									</label>
								))}
							</>
						)}
					</div>

					{errorRoles && <p className='text-xs text-destructive'>{errorRoles}</p>}

					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='text-xs shadow-none'
							disabled={actualizarRoles.isPending}
							onClick={() => handleOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button
							type='submit'
							size='sm'
							className='text-xs shadow-none'
							disabled={actualizarRoles.isPending}
						>
							{actualizarRoles.isPending ? 'Guardando...' : 'Guardar roles'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
