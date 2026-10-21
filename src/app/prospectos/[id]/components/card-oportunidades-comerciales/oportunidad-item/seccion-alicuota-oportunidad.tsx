'use client'

import type { ImportacionAlicuotasResultado } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { Button } from '@/components/button'
import DialogImportarAlicuotas from '@/components/importador-alicuotas/dialog-importar-alicuotas'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { Skeleton } from '@/components/skeleton'
import { useAlicuotaOportunidad } from '@/hooks/importacion-alicuotas/use-alicuota-oportunidad'
import { useDescargarDesgloseReconstruccion } from '@/hooks/importacion-alicuotas/use-descargar-desglose-reconstruccion'
import { useDesgloseReconstruccion } from '@/hooks/importacion-alicuotas/use-desglose-reconstruccion'
import { useImportarAlicuotaOportunidad } from '@/hooks/importacion-alicuotas/use-importar-alicuota-oportunidad'
import { formatUF } from '@/lib/uf'
import { formatearProrrateoPorcentaje } from '@/utils/formatear-prorrateo'
import { Download, FileSpreadsheet, Loader2, Upload } from 'lucide-react'
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
	const { data: desglose, isLoading: cargandoDesglose } = useDesgloseReconstruccion(idProceso)
	const importarMutation = useImportarAlicuotaOportunidad(idProceso)
	const descargarMutation = useDescargarDesgloseReconstruccion()

	const tieneAlicuota = data?.nombre_excel != null
	const desgloseCalculado = desglose?.desglose_calculado === true

	function descargarDesglose() {
		descargarMutation.mutate(idProceso, {
			onSuccess: blob => {
				const url = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = url
				a.download = `desglose_reconstruccion_oportunidad_${idProceso}.xlsx`
				a.click()
				URL.revokeObjectURL(url)
			},
			onError: () => toast.error('Error al descargar el desglose de reconstrucción'),
		})
	}

	function handleConfirmar(resultado: ImportacionAlicuotasResultado) {
		importarMutation.mutate(
			{
				nombre_excel: resultado.nombreExcel,
				unidades: resultado.unidades,
			},
			{
				onSuccess: () => {
					toast.success('Alícuota importada')
					if (desglose?.desglose_calculado) descargarDesglose()
				},
				onError: () => toast.error('Error al importar la alícuota'),
			},
		)
	}

	return (
		<div className='space-y-2 rounded-md border border-border/60 bg-muted/20 p-2.5'>
			<div className='flex items-center justify-between gap-2'>
				<p className='text-xs font-medium text-foreground'>Alícuota</p>

				<div className='flex items-center gap-1.5'>
					{desgloseCalculado ? (
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-7 gap-1 text-xs shadow-none'
							onClick={descargarDesglose}
							disabled={descargarMutation.isPending}
						>
							{descargarMutation.isPending ? (
								<Loader2 className='h-3 w-3 animate-spin' aria-hidden />
							) : (
								<Download className='h-3 w-3' aria-hidden />
							)}
							Descargar desglose
						</Button>
					) : null}

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
			</div>

			{isLoading || cargandoDesglose ? (
				<Skeleton className='h-10 w-full' />
			) : tieneAlicuota ? (
				<div className='space-y-1'>
					<p className='text-xs text-muted-foreground'>
						<span className='font-medium text-foreground'>{data.nombre_excel}</span>
						{' · '}
						{data.cantidad} unidades
					</p>

					{desgloseCalculado ? (
						<div className='flex items-center justify-between rounded-md border border-border/70 bg-card px-2.5 py-1.5'>
							<p className='text-xs text-muted-foreground'>
								Monto asegurado sugerido total
							</p>
							<p className='text-sm font-semibold text-foreground'>
								{formatUF(desglose?.monto_asegurado_sugerido_unidades ?? null)} UF
							</p>
						</div>
					) : (
						<p className='rounded-md border border-dashed border-border/70 px-2.5 py-1.5 text-xs text-muted-foreground'>
							Monto asegurado sugerido no calculado: complete los datos de
							reconstrucción del prospecto (m², UF/m² y depreciación) y vuelva a
							importar la alícuota.
						</p>
					)}

					{data.cantidad > 0 ? (
						desgloseCalculado ? (
							<div className='max-h-56 overflow-auto rounded-md border border-border/70 bg-card'>
								<table className='w-full text-xs'>
									<thead className='sticky top-0 bg-card'>
										<tr className='border-b border-border/70 text-muted-foreground'>
											<th className='px-2 py-1.5 text-left font-medium'>Unidad</th>
											<th className='px-2 py-1.5 text-right font-medium'>Prorrateo alícuota</th>
											<th className='px-2 py-1.5 text-right font-medium'>Prorrateo por monto</th>
											<th className='px-2 py-1.5 text-right font-medium'>
												Monto reconstrucción
											</th>
											<th className='px-2 py-1.5 text-right font-medium'>
												Monto sugerido
											</th>
										</tr>
									</thead>
									<tbody>
										{desglose?.unidades.map(unidad => (
											<tr
												key={`${unidad.fila_origen}-${unidad.identificador_unidad}`}
												className='border-b border-border/50 last:border-b-0'
											>
												<td className='px-2 py-1.5 font-medium text-foreground'>
													{unidad.identificador_unidad}
												</td>
												<td className='px-2 py-1.5 text-right text-muted-foreground'>
													{formatearProrrateoPorcentaje(unidad.prorrateo)}
												</td>
												<td className='px-2 py-1.5 text-right text-muted-foreground'>
													{formatearProrrateoPorcentaje(unidad.prorrateo_pago)}
												</td>
												<td className='px-2 py-1.5 text-right text-muted-foreground'>
													{formatUF(unidad.monto_reconstruccion)}
												</td>
												<td className='px-2 py-1.5 text-right text-foreground'>
													{formatUF(unidad.monto_asegurado_sugerido)}
												</td>
											</tr>
										))}
										<tr className='bg-muted/40 font-semibold'>
											<td className='px-2 py-1.5 text-foreground'>TOTAL</td>
											<td className='px-2 py-1.5 text-right text-foreground'>
												{formatearProrrateoPorcentaje(
													desglose?.unidades.reduce(
														(acumulado, unidad) => acumulado + unidad.prorrateo,
														0,
													) ?? 0,
												)}
											</td>
											<td className='px-2 py-1.5 text-right text-foreground'>
												{formatearProrrateoPorcentaje(
													desglose?.unidades.reduce(
														(acumulado, unidad) => acumulado + unidad.prorrateo_pago,
														0,
													) ?? 0,
												)}
											</td>
											<td className='px-2 py-1.5 text-right text-foreground'>
												{formatUF(
													desglose?.unidades.reduce(
														(acumulado, unidad) =>
															acumulado + unidad.monto_reconstruccion,
														0,
													) ?? 0,
												)}
											</td>
											<td className='px-2 py-1.5 text-right text-foreground'>
												{formatUF(desglose?.monto_asegurado_sugerido_unidades ?? null)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						) : (
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
						)
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
