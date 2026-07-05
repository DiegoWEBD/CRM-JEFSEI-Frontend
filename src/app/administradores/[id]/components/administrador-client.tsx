'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { Skeleton } from '@/components/skeleton'
import { Input } from '@/components/input'
import AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import { useAdministrador } from '@/hooks/administradores/use-administrador'
import { useProspectosPorAdministrador } from '@/hooks/administradores/use-prospectos-por-administrador'
import { useControlledInput } from '@/hooks/input/use-controlled-input'
import { Button } from '@/components/button'
import { Building, ExternalLink, Mail, Pencil, Phone, Search, User } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { DialogoActualizarAdministrador } from '@/components/dialogo-actualizar-administrador'

type AdministradorClientProps = {
	administradorInicial: AdministradorCondominio
}

export default function AdministradorClient({
	administradorInicial,
}: AdministradorClientProps) {
	const { data: administrador } = useAdministrador(administradorInicial)
	const { data: condominios, isLoading: condominiosLoading } =
		useProspectosPorAdministrador(administrador.id, true)
	const [dialogoAbierto, setDialogoAbierto] = useState(false)
	const { value: busqueda, handleChange } = useControlledInput()

	const condominiosFiltrados = useMemo(() => {
		if (!condominios) return []
		if (!busqueda.trim()) return condominios

		const q = busqueda.trim().toLowerCase()
		return condominios.filter(
			(c) =>
				c.nombre_riesgo.toLowerCase().includes(q) ||
				c.ejecutivo_comercial?.toLowerCase().includes(q),
		)
	}, [condominios, busqueda])

	return (
		<PanelLayout>
			<PanelHeader>
				<h1 className='text-2xl font-semibold tracking-tight'>
					{administrador.nombre_administrador}
				</h1>
			</PanelHeader>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between'>
					<CardTitle>Información del administrador</CardTitle>
					<Button
						variant='outline'
						size='sm'
						className='h-8 gap-1.5 text-xs'
						onClick={() => setDialogoAbierto(true)}
					>
						<Pencil className='size-3' />
						Editar
					</Button>
				</CardHeader>
				<CardContent className='grid gap-4 sm:grid-cols-2'>
					<div className='space-y-1'>
						<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
							<User className='size-3' />
							Nombre de contacto
						</span>
						<p className='text-sm font-medium'>
							{administrador.nombre_contacto ?? '—'}
						</p>
					</div>
					<div className='space-y-1'>
						<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
							<Phone className='size-3' />
							Teléfono
						</span>
						<p className='text-sm font-medium'>
							{administrador.telefono ?? '—'}
						</p>
					</div>
					<div className='space-y-1'>
						<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
							<Mail className='size-3' />
							Correo electrónico
						</span>
						<p className='text-sm font-medium'>
							{administrador.correo ?? '—'}
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Condominios asociados</CardTitle>
				</CardHeader>
				<CardContent className='space-y-3'>
					{condominiosLoading ? (
						<div className='space-y-3'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className='flex items-center gap-4'>
									<Skeleton className='size-10 rounded-md' />
									<div className='flex-1 space-y-1.5'>
										<Skeleton className='h-4 w-3/4' />
										<Skeleton className='h-3 w-1/2' />
									</div>
								</div>
							))}
						</div>
					) : (
						<>
							<div className='relative'>
								<Search className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
								<Input
									placeholder='Buscar por nombre del condominio o ejecutivo...'
									className='h-9 pl-9 text-sm shadow-none'
									value={busqueda}
									onChange={handleChange}
								/>
							</div>

							{condominiosFiltrados.length === 0 ? (
								<p className='py-6 text-center text-sm text-muted-foreground'>
									{busqueda.trim()
										? 'No se encontraron condominios que coincidan con la búsqueda.'
										: 'No tiene condominios asociados.'}
								</p>
							) : (
								<>
									<p className='text-[11px] text-muted-foreground'>
										{condominiosFiltrados.length} condominio
										{condominiosFiltrados.length !== 1 ? 's' : ''}
										{busqueda.trim()
											? ` coinciden con la búsqueda`
											: ''}
									</p>
									<div className='space-y-2'>
										{condominiosFiltrados.map((condominio) => (
											<div
												key={condominio.id}
												className='flex items-center gap-3 rounded-lg border p-3'
											>
												<div className='flex size-10 items-center justify-center rounded-md bg-muted'>
													<Building className='size-5 text-muted-foreground' />
												</div>
												<div className='flex-1'>
													<p className='text-sm font-medium'>
														{condominio.nombre_riesgo}
													</p>
													<p className='text-xs text-muted-foreground'>
														Ejecutivo: {condominio.ejecutivo_comercial}
													</p>
												</div>
												<Button variant='outline' size='sm' className='shrink-0 gap-1.5 text-xs' asChild>
													<Link href={`/prospectos/${condominio.id}`}>
														<ExternalLink className='size-3' />
														Ver perfil
													</Link>
												</Button>
											</div>
										))}
									</div>
								</>
							)}
						</>
					)}
				</CardContent>
			</Card>
			<DialogoActualizarAdministrador
				open={dialogoAbierto}
				onOpenChange={setDialogoAbierto}
				administrador={administrador}
				onAdministradorActualizado={() => setDialogoAbierto(false)}
			/>
		</PanelLayout>
	)
}
