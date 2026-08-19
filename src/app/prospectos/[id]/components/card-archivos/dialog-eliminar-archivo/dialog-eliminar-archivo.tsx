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
import type Archivo from '@/dominio/archivo/archivo'
import { useEliminarArchivo } from '@/hooks/archivos/use-eliminar-archivo'

type DialogEliminarArchivoProps = {
	idProspecto: number
	archivo: Archivo | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function DialogEliminarArchivo({
	idProspecto,
	archivo,
	open,
	onOpenChange,
}: DialogEliminarArchivoProps) {
	const mutation = useEliminarArchivo(idProspecto)

	if (!archivo) return null

	const handleConfirmar = async () => {
		await mutation.mutateAsync(archivo.id)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-base'>Eliminar archivo</DialogTitle>
					<DialogDescription>
						¿Eliminar <strong>{archivo.nombre_original}</strong>? Esta acción
						no se puede deshacer.
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
