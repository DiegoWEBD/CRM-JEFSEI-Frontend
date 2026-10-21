'use client'

import type { ImportacionAlicuotasResultado } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { Button } from '@/components/button'
import DialogImportarAlicuotas from '@/components/importador-alicuotas/dialog-importar-alicuotas'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { Skeleton } from '@/components/skeleton'
import { useAlicuotaOportunidad } from '@/hooks/importacion-alicuotas/use-alicuota-oportunidad'
import { useImportarAlicuotaOportunidad } from '@/hooks/importacion-alicuotas/use-importar-alicuota-oportunidad'
import { formatearProrrateoPorcentaje } from '@/utils/formatear-prorrateo'
import { FileSpreadsheet, Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type SeccionAlicuotaOportunidadProps = {
	idProceso: number
	puedeImportar: boolean
}

export default function SeccionAlicuotaOportunidad({
	idProceso,
	puedeImportar,
}: SeccionAlicuotaOportunidadProps) {
	const [importadorAbierto, setImportadorAbierto] = useState(false)
	const { data, isLoading } = useAlicuotaOportunidad(idProceso)
	const importarMutation = useImportarAlicuotaOportunidad(idProceso)

	const tieneAlicuota = data?.nombre_excel != null

	function handleConfirmar(resultado: ImportacionAlicuotasResultado) {
		importarMutation.mutate(
			{
				nombre_excel: resultado.nombreExcel,
				unidades: resultado.unidades,
			},
			{
				onSuccess: () => toast.success('Alícuota importada'),
				onError: () => toast.error('Error al importar la alícuota'),
			},
		)
	}

	return (
		<div className='space-y-2 rounded-md border border-border/60 bg-muted/20 p-2.5'>
			<div className='flex items-center justify-between gap-2'>
				<p className='text-xs font-medium text-foreground'>Alícuota</p>

				{puedeImportar ? (
					<PermissionGuard allowedPermissions={['SOLICITAR_COTIZACION']}>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-7 gap-1 text-xs shadow-none'
							onClick={() => setImportadorAbierto(true)}
						>
							{tieneAlicuota ? (
								<Upload className='h-3 w-3' aria-hidden />
							) : (
								<FileSpreadsheet className='h-3 w-3' aria-hidden />
							)}
							{importarMutation.isPending ? (
								<>
									<Loader2 className='h-3 w-3 animate-spin' aria-hidden />
									Importando...
								</>
							) : tieneAlicuota ? (
								'Reemplazar importación'
							) : (
								'Importar alicuota'
							)}
						</Button>
					</PermissionGuard>
				) : null}
			</div>

			{isLoading ? (
				<Skeleton className='h-10 w-full' />
			) : tieneAlicuota ? (
				<div className='space-y-1'>
					<p className='text-xs text-muted-foreground'>
						<span className='font-medium text-foreground'>{data.nombre_excel}</span>
						{' · '}
						{data.cantidad} unidades
					</p>

					{data.cantidad > 0 ? (
						<div className='max-h-40 space-y-0.5 overflow-auto rounded-md border border-border/70 bg-card p-2'>
							{data.unidades.map(unidad => (
								<div
									key={`${unidad.fila_origen}-${unidad.identificador_unidad}`}
									className='flex items-center justify-between gap-3 text-xs'
								>
									<span className='font-medium text-foreground'>
										{unidad.identificador_unidad}
									</span>
									<span className='text-muted-foreground'>
										{formatearProrrateoPorcentaje(unidad.prorrateo)}
									</span>
								</div>
							))}
						</div>
					) : null}
				</div>
			) : (
				<p className='text-xs text-muted-foreground'>
					Sin alícuota importada. Puede importarla en cualquier momento.
				</p>
			)}

			<DialogImportarAlicuotas
				open={importadorAbierto}
				onOpenChange={setImportadorAbierto}
				onConfirmar={handleConfirmar}
			/>
		</div>
	)
}
