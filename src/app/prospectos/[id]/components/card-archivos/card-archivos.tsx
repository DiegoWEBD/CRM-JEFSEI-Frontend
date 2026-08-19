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
import type Archivo from '@/dominio/archivo/archivo'
import { useObtenerArchivos } from '@/hooks/archivos/use-obtener-archivos'
import { FileText } from 'lucide-react'
import { useState } from 'react'
import CardArchivosSkeleton from './card-archivos-skeleton'
import DialogEliminarArchivo from './dialog-eliminar-archivo/dialog-eliminar-archivo'
import DialogSubirArchivo from './dialog-subir-archivo/dialog-subir-archivo'
import ListaArchivos from './lista-archivos/lista-archivos'

type CardArchivosProps = {
	idProspecto: number
}

export default function CardArchivos({ idProspecto }: CardArchivosProps) {
	const { data: archivos, isLoading } = useObtenerArchivos(idProspecto)
	const [dialogSubir, setDialogSubir] = useState(false)
	const [archivoAEliminar, setArchivoAEliminar] = useState<Archivo | null>(null)

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle className='min-w-0 text-sm font-semibold leading-tight tracking-tight text-foreground'>
					Archivos
				</CardTitle>
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-8 text-xs'
					onClick={() => setDialogSubir(true)}
				>
					Subir archivo
				</Button>
			</CardHeader>

			<CardContent className='p-4'>
				{isLoading ? (
					<CardArchivosSkeleton />
				) : !archivos || archivos.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant='icon'>
								<FileText />
							</EmptyMedia>
							<EmptyTitle>Sin archivos</EmptyTitle>
							<EmptyDescription>
								No hay archivos adjuntos para este prospecto.
							</EmptyDescription>
						</EmptyHeader>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-8 text-xs'
							onClick={() => setDialogSubir(true)}
						>
							Subir archivo
						</Button>
					</Empty>
				) : (
					<ListaArchivos
						archivos={archivos}
						idProspecto={idProspecto}
						onEliminar={a => setArchivoAEliminar(a)}
					/>
				)}
			</CardContent>

			<DialogSubirArchivo
				idProspecto={idProspecto}
				open={dialogSubir}
				onOpenChange={setDialogSubir}
			/>
			<DialogEliminarArchivo
				idProspecto={idProspecto}
				archivo={archivoAEliminar}
				open={archivoAEliminar !== null}
				onOpenChange={o => {
					if (!o) setArchivoAEliminar(null)
				}}
			/>
		</Card>
	)
}
