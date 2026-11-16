'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import { Input } from '@/components/input'
import Paginacion from '@/components/paginacion/paginacion'
import { Skeleton } from '@/components/skeleton'
import Usuario from '@/dominio/usuario/usuario'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import { useDebounce } from '@/hooks/use-debounce'
import { RefreshCw, Search, UserCog } from 'lucide-react'
import { useState } from 'react'
import DialogAsignarRolesUsuario from './dialog-asignar-roles-usuario'

const TAMANO_PAGINA = 10

function SkeletonTabla() {
	return (
		<div className='space-y-2'>
			{Array.from({ length: 6 }).map((_, i) => (
				<Skeleton key={i} className='h-10 w-full rounded-md' />
			))}
		</div>
	)
}

function ListaRoles({ usuario }: { usuario: Usuario }) {
	if (usuario.roles.length === 0) {
		return <p className='text-xs text-muted-foreground'>Sin roles</p>
	}

	return (
		<div className='flex flex-wrap gap-1'>
			{usuario.roles.map(rol => (
				<Badge key={rol.codigo} variant='pastel-sky'>
					{rol.nombre}
				</Badge>
			))}
		</div>
	)
}

export default function RolesDeUsuarios() {
	const [pagina, setPagina] = useState(1)
	const [inputBusqueda, setInputBusqueda] = useState('')
	const textoBusqueda = useDebounce(inputBusqueda, 300)
	const [usuarioSeleccionado, setUsuarioSeleccionado] =
		useState<Usuario | null>(null)

	const {
		data: respuesta,
		isFetching,
		refetch,
	} = useUsuarios({
		texto_busqueda: textoBusqueda || undefined,
		pagina,
		tamano_pagina: TAMANO_PAGINA,
	})

	const usuarios = respuesta?.data || []

	const cambiarBusqueda = (valor: string) => {
		setInputBusqueda(valor)
		setPagina(1)
	}

	return (
		<>
			<div className='flex flex-wrap items-center gap-2'>
				<div className='relative min-w-0 flex-1'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Buscar por RUT, nombre, correo o rol...'
						value={inputBusqueda}
						onChange={e => cambiarBusqueda(e.target.value)}
						className='h-9 pl-9 text-sm shadow-none'
					/>
				</div>

				<Button
					variant='outline'
					size='sm'
					onClick={() => refetch()}
					disabled={isFetching}
				>
					<RefreshCw
						className={`mr-1 size-4 ${isFetching ? 'animate-spin' : ''}`}
					/>
					{isFetching ? 'Actualizando...' : 'Actualizar'}
				</Button>
			</div>

			<p className='mt-3 text-xs text-muted-foreground'>
				Mostrando {usuarios.length} de {respuesta?.total || 0} usuarios
			</p>

			<div className='mt-3'>
				{isFetching && usuarios.length === 0 ? (
					<SkeletonTabla />
				) : usuarios.length === 0 ? (
					<div className='flex items-center justify-center py-12'>
						<p className='text-sm text-muted-foreground'>
							No se encontraron usuarios
						</p>
					</div>
				) : (
					<>
						{/* Mobile: cards */}
						<div className='space-y-3 lg:hidden'>
							{usuarios.map(usuario => (
								<Card
									key={usuario.rut}
									className='border-border bg-card shadow-none'
								>
									<CardContent className='p-4'>
										<div className='flex items-start justify-between gap-2'>
											<div className='min-w-0 flex-1 space-y-1'>
												<p className='truncate text-sm font-semibold text-foreground'>
													{usuario.nombre}
												</p>
												<p className='text-xs text-muted-foreground'>
													{usuario.rut}
												</p>
												<p className='text-xs text-muted-foreground'>
													{usuario.correo ?? '-'}
												</p>
												<ListaRoles usuario={usuario} />
											</div>
											<Button
												variant='outline'
												size='sm'
												className='text-xs'
												onClick={() => setUsuarioSeleccionado(usuario)}
											>
												<UserCog className='mr-1 size-3' />
												Asignar roles
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
							<Paginacion
								pagina={pagina}
								totalPaginas={respuesta?.total_paginas || 0}
								onPaginaChange={setPagina}
							/>
						</div>

						{/* Desktop: tabla */}
						<div className='hidden lg:block'>
							<div
								className={`overflow-x-auto rounded-lg border border-border ${
									isFetching ? 'opacity-60' : ''
								}`}
							>
								<table className='w-full text-sm'>
									<thead>
										<tr className='border-b border-border bg-muted/40'>
											<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
												Usuario
											</th>
											<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
												Correo
											</th>
											<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
												Sucursal
											</th>
											<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
												Roles
											</th>
											<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
												Acciones
											</th>
										</tr>
									</thead>
									<tbody>
										{usuarios.map(usuario => (
											<tr
												key={usuario.rut}
												className='border-b border-border/50 transition-colors hover:bg-accent/50 last:border-b-0'
											>
												<td className='px-4 py-2.5'>
													<p className='max-w-40 truncate text-xs font-medium text-foreground'>
														{usuario.nombre}
													</p>
													<p className='text-xs text-muted-foreground'>
														{usuario.rut}
													</p>
												</td>
												<td className='max-w-48 truncate px-4 py-2.5 text-xs text-foreground'>
													{usuario.correo ?? '-'}
												</td>
												<td className='whitespace-nowrap px-4 py-2.5 text-xs text-foreground'>
													{usuario.sucursal}
												</td>
												<td className='px-4 py-2.5'>
													<ListaRoles usuario={usuario} />
												</td>
												<td className='px-4 py-2.5'>
													<Button
														variant='outline'
														size='sm'
														className='text-xs'
														onClick={() => setUsuarioSeleccionado(usuario)}
													>
														<UserCog className='mr-1 size-3' />
														Asignar roles
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<Paginacion
								pagina={pagina}
								totalPaginas={respuesta?.total_paginas || 0}
								onPaginaChange={setPagina}
							/>
						</div>
					</>
				)}
			</div>

			<DialogAsignarRolesUsuario
				usuario={usuarioSeleccionado}
				cerrarDialog={() => setUsuarioSeleccionado(null)}
			/>
		</>
	)
}
