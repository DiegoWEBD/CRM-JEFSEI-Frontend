'use client'

import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import Contacto from '@/dominio/contacto/contacto'
import { useEliminarContacto } from '@/hooks/contactos/use-eliminar-contacto'

type DialogEliminarContactoProps = {
	idProspecto: number
	contacto: Contacto | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function DialogEliminarContacto({
	idProspecto,
	contacto,
	open,
	onOpenChange,
}: DialogEliminarContactoProps) {
	const mutation = useEliminarContacto(idProspecto)

	if (!contacto) return null

	const handleConfirmar = async () => {
		await mutation.mutateAsync(contacto.id)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-base'>Eliminar contacto</DialogTitle>
					<DialogDescription>
						¿Eliminar a <strong>{contacto.nombre}</strong>? Esta acción no se
						puede deshacer.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='h-8 text-xs'
						onClick={() => onOpenChange(false)}
						disabled={mutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type='button'
						variant='destructive'
						size='sm'
						className='h-8 text-xs'
						onClick={handleConfirmar}
						disabled={mutation.isPending}
					>
						Eliminar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}