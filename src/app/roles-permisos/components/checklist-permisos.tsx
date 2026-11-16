'use client'

import {
	PermisoJson,
	RolConPermisosJson,
} from '@/aplicacion/roles/dtos/rol-con-permisos-json'
import { Button } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import ConfirmDialog from '@/components/confirm-dialog/confirm-dialog'
import { Skeleton } from '@/components/skeleton'
import { usePermisos } from '@/hooks/permisos/use-permisos'
import { useAsignarPermisosRol } from '@/hooks/roles/use-asignar-permisos-rol'
import { Save } from 'lucide-react'
import { useMemo, useState } from 'react'

type ChecklistPermisosProps = {
	rol: RolConPermisosJson
	textoBusqueda: string
}

function SkeletonChecklist() {
	return (
		<div className='space-y-2'>
			{Array.from({ length: 8 }).map((_, i) => (
				<Skeleton key={i} className='h-12 w-full rounded-md' />
			))}
		</div>
	)
}

export default function ChecklistPermisos({
	rol,
	textoBusqueda,
}: ChecklistPermisosProps) {
	const { data: permisos, isFetching } = usePermisos()
	const [seleccionados, setSeleccionados] = useState<Set<string>>(
		() => new Set(rol.permisos.map(permiso => permiso.codigo)),
	)
	const [confirmarAbierto, setConfirmarAbierto] = useState(false)
	const asignarPermisos = useAsignarPermisosRol()

	const texto = textoBusqueda.toLowerCase()
	const permisosFiltrados = (permisos ?? []).filter((permiso: PermisoJson) =>
		`${permiso.codigo} ${permiso.nombre} ${permiso.descripcion}`
			.toLowerCase()
			.includes(texto),
	)

	const hayCambios = useMemo(() => {
		const originales = new Set(rol.permisos.map(permiso => permiso.codigo))
		if (originales.size !== seleccionados.size) return true
		for (const codigo of seleccionados) {
			if (!originales.has(codigo)) return true
		}
		return false
	}, [rol.permisos, seleccionados])

	const alternar = (codigo: string) => {
		setSeleccionados(previos => {
			const nuevos = new Set(previos)
			if (nuevos.has(codigo)) {
				nuevos.delete(codigo)
			} else {
				nuevos.add(codigo)
			}
			return nuevos
		})
	}

	const guardar = () => {
		asignarPermisos.mutate(
			{ codigoRol: rol.codigo, codigosPermiso: [...seleccionados] },
			{ onSuccess: () => setConfirmarAbierto(false) },
		)
	}

	if (isFetching && !permisos) {
		return <SkeletonChecklist />
	}

	return (
		<>
			<div className='flex flex-wrap items-center justify-between gap-2'>
				<p className='text-xs text-muted-foreground'>
					{seleccionados.size} de {permisos?.length ?? 0} permisos asignados a{' '}
					<strong>{rol.nombre}</strong>
				</p>

				<Button
					size='sm'
					className='text-xs shadow-none'
					disabled={!hayCambios || asignarPermisos.isPending}
					onClick={() => setConfirmarAbierto(true)}
				>
					<Save className='mr-1 size-3' />
					{asignarPermisos.isPending ? 'Guardando...' : 'Guardar cambios'}
				</Button>
			</div>

			<div className='overflow-hidden rounded-lg border border-border'>
				{permisosFiltrados.length === 0 ? (
					<div className='flex items-center justify-center py-12'>
						<p className='text-sm text-muted-foreground'>
							No se encontraron permisos
						</p>
					</div>
				) : (
					<ul>
						{permisosFiltrados.map((permiso: PermisoJson) => (
							<li
								key={permiso.codigo}
								className='flex items-start gap-2.5 border-b border-border/50 px-3 py-2 transition-colors last:border-b-0 hover:bg-accent/50'
							>
								<Checkbox
									id={`${rol.codigo}-${permiso.codigo}`}
									checked={seleccionados.has(permiso.codigo)}
									onCheckedChange={() => alternar(permiso.codigo)}
									aria-label={`Permiso ${permiso.codigo}`}
									className='mt-0.5'
								/>
								<label
									htmlFor={`${rol.codigo}-${permiso.codigo}`}
									className='min-w-0 cursor-pointer'
								>
									<p className='text-xs font-medium text-foreground'>
										{permiso.nombre}
									</p>
									<p className='text-xs text-muted-foreground'>
										{permiso.descripcion}
									</p>
								</label>
							</li>
						))}
					</ul>
				)}
			</div>

			<ConfirmDialog
				open={confirmarAbierto}
				onOpenChange={setConfirmarAbierto}
				title='Guardar permisos del rol'
				description={`Se actualizarán los permisos del rol ${rol.nombre}: quedarán ${seleccionados.size} permisos asignados.`}
				confirmText='Guardar'
				cancelText='Cancelar'
				variant='default'
				onConfirm={guardar}
				isPending={asignarPermisos.isPending}
			/>
		</>
	)
}
