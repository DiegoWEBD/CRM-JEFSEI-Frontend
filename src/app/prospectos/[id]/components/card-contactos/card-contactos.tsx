'use client'

import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/empty'
import Contacto from '@/dominio/contacto/contacto'
import { useObtenerContactos } from '@/hooks/contactos/use-obtener-contactos'
import { ContactRound } from 'lucide-react'
import { useState } from 'react'
import CardContactosSkeleton from './card-contactos-skeleton'
import DialogEditarContacto from './dialog-editar-contacto/dialog-editar-contacto'
import DialogEliminarContacto from './dialog-eliminar-contacto/dialog-eliminar-contacto'
import DialogRegistrarContacto from './dialog-registrar-contacto/dialog-registrar-contacto'
import ListaContactos from './lista-contactos/lista-contactos'

type CardContactosProps = {
	idProspecto: number
}

export default function CardContactos({ idProspecto }: CardContactosProps) {
	const { data: contactos, isLoading } = useObtenerContactos(idProspecto)
	const [dialogRegistrar, setDialogRegistrar] = useState(false)
	const [contactoAEditar, setContactoAEditar] = useState<Contacto | null>(null)
	const [contactoAEliminar, setContactoAEliminar] = useState<Contacto | null>(
		null,
	)

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle className='min-w-0 text-sm font-semibold leading-tight tracking-tight text-foreground'>
					Información de contacto
				</CardTitle>
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-8 text-xs'
					onClick={() => setDialogRegistrar(true)}
				>
					Agregar contacto
				</Button>
			</CardHeader>

			<CardContent className='p-4'>
				{isLoading ? (
					<CardContactosSkeleton />
				) : !contactos || contactos.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant='icon'>
								<ContactRound />
							</EmptyMedia>
							<EmptyTitle>Sin contactos</EmptyTitle>
							<EmptyDescription>
								No hay contactos registrados para este prospecto.
							</EmptyDescription>
						</EmptyHeader>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-8 text-xs'
							onClick={() => setDialogRegistrar(true)}
						>
							Agregar contacto
						</Button>
					</Empty>
				) : (
					<ListaContactos
						contactos={contactos}
						onEditar={c => setContactoAEditar(c)}
						onEliminar={c => setContactoAEliminar(c)}
					/>
				)}
			</CardContent>

			<DialogRegistrarContacto
				idProspecto={idProspecto}
				open={dialogRegistrar}
				onOpenChange={setDialogRegistrar}
			/>
			<DialogEditarContacto
				idProspecto={idProspecto}
				contacto={contactoAEditar}
				open={contactoAEditar !== null}
				onOpenChange={o => {
					if (!o) setContactoAEditar(null)
				}}
			/>
			<DialogEliminarContacto
				idProspecto={idProspecto}
				contacto={contactoAEliminar}
				open={contactoAEliminar !== null}
				onOpenChange={o => {
					if (!o) setContactoAEliminar(null)
				}}
			/>
		</Card>
	)
}
