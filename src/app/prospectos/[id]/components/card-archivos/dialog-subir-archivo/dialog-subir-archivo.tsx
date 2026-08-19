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
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { useSubirArchivo } from '@/hooks/archivos/use-subir-archivo'
import { Loader2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

type DialogSubirArchivoProps = {
	idProspecto: number
	open: boolean
	onOpenChange: (open: boolean) => void
}

const ACCEPT = '.pdf,.jpg,.jpeg,.png,.gif,.webp,.xlsx,.xls,.docx,.doc'

export default function DialogSubirArchivo({
	idProspecto,
	open,
	onOpenChange,
}: DialogSubirArchivoProps) {
	const [archivo, setArchivo] = useState<File | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const subirMutation = useSubirArchivo(idProspecto)

	const handleOpenChange = (next: boolean) => {
		if (!next) setArchivo(null)
		onOpenChange(next)
	}

	const handleSubmit = async () => {
		if (!archivo) return
		await subirMutation.mutateAsync({ archivo })
		setArchivo(null)
		onOpenChange(false)
	}

	const puedeSubir = archivo != null && !subirMutation.isPending

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-md gap-0 p-0'>
				<DialogHeader className='border-b border-border px-4 py-3 pr-12'>
					<DialogTitle className='text-base'>Subir archivo</DialogTitle>
					<DialogDescription>
						Seleccione un archivo para adjuntarlo a este prospecto.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4 px-4 py-4'>
					<div className='space-y-2'>
						<Label htmlFor='archivo' className='text-xs font-medium'>
							Archivo
						</Label>
						<Input
							ref={inputRef}
							id='archivo'
							type='file'
							accept={ACCEPT}
							className='h-9 text-xs file:h-8 file:text-xs'
							onChange={e => setArchivo(e.target.files?.[0] ?? null)}
						/>
						{archivo && (
							<p className='text-xs text-muted-foreground'>
								{archivo.name} ({(archivo.size / 1024).toFixed(1)} KB)
							</p>
						)}
					</div>
				</div>

				<DialogFooter className='border-t border-border px-4 py-3'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() => onOpenChange(false)}
						disabled={subirMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type='button'
						size='sm'
						onClick={handleSubmit}
						disabled={!puedeSubir}
					>
						{subirMutation.isPending ? (
							<>
								<Loader2 className='mr-1.5 size-3.5 animate-spin' aria-hidden />
								Subiendo…
							</>
						) : (
							<>
								<Upload className='mr-1.5 size-3.5' aria-hidden />
								Subir archivo
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
