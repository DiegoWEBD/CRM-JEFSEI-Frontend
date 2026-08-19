'use client'

import { Button } from '@/components/button'
import { ScrollArea } from '@/components/scroll-area'
import type Archivo from '@/dominio/archivo/archivo'
import { Download, File, Trash2 } from 'lucide-react'
import {
	FaFileExcel,
	FaFileImage,
	FaFilePdf,
	FaFileWord,
} from 'react-icons/fa6'

type ListaArchivosProps = {
	archivos: Archivo[]
	idProspecto: number
	onEliminar: (archivo: Archivo) => void
}

const UMBRAL_SCROLL = 4
const ALTURA_MAX = 'max-h-[min(240px,36vh)]'

function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B'
	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

function getIconByType(tipoContenido: string) {
	if (tipoContenido.startsWith('image/'))
		return <FaFileImage className='h-4 w-4 text-yellow-600' />
	if (tipoContenido.includes('pdf'))
		return <FaFilePdf className='h-4 w-4 text-red-600' />
	if (tipoContenido.includes('excel') || tipoContenido.includes('spreadsheet'))
		return <FaFileExcel className='h-4 w-4 text-emerald-600' />
	if (tipoContenido.includes('word') || tipoContenido.includes('document'))
		return <FaFileWord className='h-4 w-4 text-blue-600' />
	return <File className='h-4 w-4 text-muted-foreground' />
}

export default function ListaArchivos({
	archivos,
	idProspecto,
	onEliminar,
}: ListaArchivosProps) {
	const usarScroll = archivos.length > UMBRAL_SCROLL

	const handleDescargar = (archivo: Archivo) => {
		window.open(
			`/api/prospectos/${idProspecto}/archivos/${archivo.id}`,
			'_blank',
		)
	}

	const tabla = (
		<table className='w-full text-xs'>
			<thead>
				<tr className='border-b border-border text-left text-muted-foreground'>
					<th className='pb-1.5 font-medium' colSpan={2}>
						Nombre
					</th>
					<th className='pb-1.5 font-medium'>Tamaño</th>
					<th className='pb-1.5 font-medium'>Fecha</th>
					<th className='pb-1.5 font-medium' />
				</tr>
			</thead>
			<tbody>
				{archivos.map(archivo => (
					<tr
						key={archivo.id}
						className='border-b border-border/40 last:border-0'
					>
						<td className='py-1.5 pr-1'>
							{getIconByType(archivo.tipo_contenido)}
						</td>
						<td className='max-w-35 truncate py-1.5 font-medium text-foreground'>
							{archivo.nombre_original}
						</td>
						<td className='py-1.5 text-muted-foreground'>
							{formatBytes(archivo.tamano_bytes)}
						</td>
						<td className='py-1.5 text-muted-foreground'>
							{new Date(archivo.created_at).toLocaleDateString('es-CL')}
						</td>
						<td className='py-1.5'>
							<div className='flex justify-end gap-0.5'>
								<Button
									variant='ghost'
									size='icon-sm'
									onClick={() => handleDescargar(archivo)}
									aria-label='Descargar archivo'
								>
									<Download className='h-3.5 w-3.5' />
								</Button>
								<Button
									variant='ghost'
									size='icon-sm'
									onClick={() => onEliminar(archivo)}
									aria-label='Eliminar archivo'
									className='text-destructive hover:text-destructive'
								>
									<Trash2 className='h-3.5 w-3.5' />
								</Button>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)

	return usarScroll ? (
		<ScrollArea className={ALTURA_MAX}>{tabla}</ScrollArea>
	) : (
		tabla
	)
}
