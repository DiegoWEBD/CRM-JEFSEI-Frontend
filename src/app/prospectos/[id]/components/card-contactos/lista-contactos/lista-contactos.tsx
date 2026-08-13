'use client'

import { Button } from '@/components/button'
import { ScrollArea } from '@/components/scroll-area'
import Contacto from '@/dominio/contacto/contacto'
import { Mail, Pencil, Phone, Trash2 } from 'lucide-react'
import { type ReactNode } from 'react'

type ListaContactosProps = {
	contactos: Contacto[]
	onEditar: (contacto: Contacto) => void
	onEliminar: (contacto: Contacto) => void
}

const UMBRAL_SCROLL = 4
const ALTURA_MAX = 'max-h-[min(320px,42vh)]'

function TextoOVacio({ valor, icon }: { valor?: string | null; icon?: ReactNode }) {
	if (!valor) return <span className='text-muted-foreground'>—</span>
	return (
		<span className='flex items-center gap-1 text-foreground'>
			{icon && <span className='text-muted-foreground'>{icon}</span>}
			<span className='truncate'>{valor}</span>
		</span>
	)
}

export default function ListaContactos({
	contactos,
	onEditar,
	onEliminar,
}: ListaContactosProps) {
	const usarScroll = contactos.length > UMBRAL_SCROLL

	const grid = (
		<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3'>
			{contactos.map(contacto => (
				<div
					key={contacto.id}
					className='rounded-md border border-border/60 bg-background p-3 text-xs'
				>
					<div className='flex items-start justify-between gap-2'>
						<p className='font-medium leading-tight text-foreground'>
							{contacto.nombre}
						</p>
						<div className='flex shrink-0 gap-0.5'>
							<Button
								variant='ghost'
								size='icon-sm'
								onClick={() => onEditar(contacto)}
								aria-label='Editar contacto'
							>
								<Pencil className='h-3.5 w-3.5' />
							</Button>
							<Button
								variant='ghost'
								size='icon-sm'
								onClick={() => onEliminar(contacto)}
								aria-label='Eliminar contacto'
								className='text-destructive hover:text-destructive'
							>
								<Trash2 className='h-3.5 w-3.5' />
							</Button>
						</div>
					</div>

					<div className='mt-2 space-y-1'>
						{contacto.cargo && (
							<p className='italic text-muted-foreground'>{contacto.cargo}</p>
						)}
						<p>
							<TextoOVacio
								valor={contacto.telefono}
								icon={<Phone className='h-3 w-3' />}
							/>
						</p>
						<p>
							<TextoOVacio
								valor={contacto.correo}
								icon={<Mail className='h-3 w-3' />}
							/>
						</p>
					</div>
				</div>
			))}
		</div>
	)

	return usarScroll ? <ScrollArea className={ALTURA_MAX}>{grid}</ScrollArea> : grid
}