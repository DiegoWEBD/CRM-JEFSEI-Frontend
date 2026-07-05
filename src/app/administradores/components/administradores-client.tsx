'use client'

import { Card, CardContent } from '@/components/card'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Skeleton } from '@/components/skeleton'
import AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import { useAdministradores } from '@/hooks/administradores/use-administradores'
import { useControlledInput } from '@/hooks/input/use-controlled-input'
import { Building2, ExternalLink, Mail, Phone, Plus, Search, User } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { DialogoRegistrarAdministrador } from '@/components/dialogo-registrar-administrador'

type AdministradoresClientProps = {
	administradoresIniciales: AdministradorCondominio[]
}

function AdminCard({
	administrador,
}: {
	administrador: AdministradorCondominio
}) {
	const iniciales = administrador.nombre_administrador
		.split(' ')
		.map((p) => p.charAt(0).toUpperCase())
		.slice(0, 2)
		.join('')

	return (
		<Card className='overflow-hidden transition-shadow hover:shadow-md'>
			<CardContent className='p-4'>
				<div className='flex items-start gap-3'>
					<div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-highlight-light text-xs font-semibold text-primary-highlight'>
						{iniciales}
					</div>

					<div className='min-w-0 flex-1 space-y-1.5'>
						<h3 className='truncate text-sm font-semibold leading-tight text-foreground'>
							{administrador.nombre_administrador}
						</h3>

						{administrador.nombre_contacto && (
							<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
								<User className='size-3 shrink-0' />
								<span className='truncate'>
									{administrador.nombre_contacto}
								</span>
							</div>
						)}

						{administrador.telefono && (
							<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
								<Phone className='size-3 shrink-0' />
								<span>{administrador.telefono}</span>
							</div>
						)}

						{administrador.correo && (
							<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
								<Mail className='size-3 shrink-0' />
								<span className='truncate'>{administrador.correo}</span>
							</div>
						)}

						{!administrador.nombre_contacto &&
							!administrador.telefono &&
							!administrador.correo && (
								<p className='text-xs italic text-muted-foreground'>
									Sin información de contacto
								</p>
							)}
					</div>

					<Button
						variant='outline'
						size='sm'
						className='mt-0.5 shrink-0 gap-1 text-xs'
						asChild
					>
						<Link href={`/administradores/${administrador.id}`}>
							<ExternalLink className='size-3' />
							<span className='hidden sm:inline'>Ver perfil</span>
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export default function AdministradoresClient({
	administradoresIniciales,
}: AdministradoresClientProps) {
	const { data: administradores, isLoading } = useAdministradores(
		administradoresIniciales,
	)
	const [dialogoAbierto, setDialogoAbierto] = useState(false)
	const { value: busqueda, handleChange } = useControlledInput()

	const administradoresFiltrados = useMemo(() => {
		if (!administradores) return []
		if (!busqueda.trim()) return administradores

		const q = busqueda.trim().toLowerCase()
		return administradores.filter(
			(a) =>
				a.nombre_administrador.toLowerCase().includes(q) ||
				a.nombre_contacto?.toLowerCase().includes(q) ||
				a.telefono?.includes(q) ||
				a.correo?.toLowerCase().includes(q),
		)
	}, [administradores, busqueda])

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<Skeleton className='h-9 w-full rounded-md' />
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<Card key={i}>
							<CardContent className='flex items-start gap-3 p-4'>
								<Skeleton className='size-10 shrink-0 rounded-full' />
								<div className='min-w-0 flex-1 space-y-2'>
									<Skeleton className='h-5 w-3/4' />
									<Skeleton className='h-3 w-1/2' />
									<Skeleton className='h-3 w-2/3' />
									<Skeleton className='h-3 w-1/3' />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between gap-3'>
				<div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
					<Building2 className='size-4' />
					<span>
						{administradoresFiltrados.length} administrador
						{administradoresFiltrados.length !== 1 ? 'es' : ''}
					</span>
				</div>
				<Button
					size='sm'
					className='h-9 text-xs'
					onClick={() => setDialogoAbierto(true)}
				>
					<Plus className='mr-1.5 size-3.5' />
					Registrar administrador
				</Button>
			</div>

			<div className='relative'>
				<Search className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					placeholder='Buscar por nombre, contacto, teléfono o correo...'
					className='h-9 pl-9 text-sm shadow-none'
					value={busqueda}
					onChange={handleChange}
				/>
			</div>

			{administradoresFiltrados.length === 0 ? (
				<Card>
					<CardContent className='flex flex-col items-center gap-2 py-12'>
						<Building2 className='size-10 text-muted-foreground/40' />
						<p className='text-sm text-muted-foreground'>
							{busqueda.trim()
								? 'No se encontraron administradores que coincidan con la búsqueda.'
								: 'No hay administradores registrados.'}
						</p>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{administradoresFiltrados.map((administrador) => (
						<AdminCard
							key={administrador.id}
							administrador={administrador}
						/>
					))}
				</div>
			)}

			<DialogoRegistrarAdministrador
				open={dialogoAbierto}
				onOpenChange={setDialogoAbierto}
			/>
		</div>
	)
}
