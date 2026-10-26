'use client'

import type { ImportacionAlicuotasResultado } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { Button } from '@/components/button'
import DialogDetalleAlicuota from '@/components/importador-alicuotas/dialog-detalle-alicuota'
import DialogImportarAlicuotas from '@/components/importador-alicuotas/dialog-importar-alicuotas'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { Skeleton } from '@/components/skeleton'
import { useAlicuotaOportunidad } from '@/hooks/importacion-alicuotas/use-alicuota-oportunidad'
import { useCambiosUnidadesAlicuota } from '@/hooks/importacion-alicuotas/use-cambios-unidades-alicuota'
import { useDescargarDesgloseReconstruccion } from '@/hooks/importacion-alicuotas/use-descargar-desglose-reconstruccion'
import { useDesgloseReconstruccion } from '@/hooks/importacion-alicuotas/use-desglose-reconstruccion'
import { useImportarAlicuotaOportunidad } from '@/hooks/importacion-alicuotas/use-importar-alicuota-oportunidad'
import { formatUF } from '@/lib/uf'
import { Download, Eye, FileSpreadsheet, Loader2, Upload } from 'lucide-react'
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
	const [detalleAbierto, setDetalleAbierto] = useState(false)
	const { data, isLoading } = useAlicuotaOportunidad(idProceso)
	const { data: desglose, isLoading: cargandoDesglose } =
		useDesgloseReconstruccion(idProceso)
	const importarMutation = useImportarAlicuotaOportunidad(idProceso)
	const descargarMutation = useDescargarDesgloseReconstruccion()
	const cambios = useCambiosUnidadesAlicuota(idProceso, data, desglose)

	const tieneAlicuota = data?.nombre_excel != null
	const desgloseCalculado = desglose?.desglose_calculado === true
	const puedeAdministrar = data?.puede_administrar_alicuota === true

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
			onError: () =>
				toast.error('Error al descargar el desglose de reconstrucción'),
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
					// La reimportación reemplaza las unidades: el borrador apuntaba a
					// unidades que ya no existen.
					cambios.descartarCambios()
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
				<div className='flex items-center gap-1.5'>
					<p className='text-xs font-medium text-foreground'>Alícuota</p>

					{puedeAdministrar && cambios.cantidadCambios > 0 ? (
						<span className='rounded bg-amber-500/10 px-1 py-0.5 text-[10px] font-medium text-amber-600'>
							{cambios.cantidadCambios}{' '}
							{cambios.cantidadCambios === 1
								? 'cambio sin guardar'
								: 'cambios sin guardar'}
						</span>
					) : null}
				</div>

				<div className='flex items-center gap-1.5'>
					{tieneAlicuota ? (
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-7 gap-1 text-xs shadow-none'
							onClick={() => setDetalleAbierto(true)}
						>
							<Eye className='h-3 w-3' aria-hidden />
							Ver detalle
						</Button>
					) : null}

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
			) : tieneAlicuota && data ? (
				<div className='space-y-1'>
					<p className='text-xs text-muted-foreground'>
						<span className='font-medium text-foreground'>
							{data.nombre_excel}
						</span>
						{' · '}
						{data.cantidad} unidades
						{cambios.totales.cantidadDescartadas > 0
							? ` (${cambios.totales.cantidadDescartadas} descartadas)`
							: ''}
					</p>

					{desgloseCalculado ? (
						<div className='flex items-center justify-between rounded-md border border-border/70 bg-card px-2.5 py-1.5'>
							<p className='text-xs text-muted-foreground'>
								Monto asegurado total
								{cambios.totales.montoSugerido !== cambios.totales.montoAsegurado ? (
									<span className='text-muted-foreground/70'>
										{' '}
										(sugerido: {formatUF(cambios.totales.montoSugerido)})
									</span>
								) : null}
							</p>
							<p className='text-sm font-semibold text-foreground'>
								{formatUF(cambios.totales.montoAsegurado)}
							</p>
						</div>
					) : (
						<p className='rounded-md border border-dashed border-border/70 px-2.5 py-1.5 text-xs text-muted-foreground'>
							Monto asegurado sugerido no calculado: complete los datos de
							reconstrucción del prospecto (m², UF/m² y depreciación). Los montos
							asegurados personalizados que fije en el detalle se aplicarán al
							cálculo.
						</p>
					)}
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

			{tieneAlicuota && data ? (
				<DialogDetalleAlicuota
					open={detalleAbierto}
					onOpenChange={setDetalleAbierto}
					data={data}
					desglose={desglose}
					cambios={cambios}
				/>
			) : null}
		</div>
	)
}
