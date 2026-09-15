'use client'

import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import { ScrollArea } from '@/components/scroll-area'
import { Skeleton } from '@/components/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/table'
import { useCotizaciones } from '@/hooks/cotizaciones/use-cotizaciones'
import { ESTADO_COTIZACION_VARIANT, ESTADO_COTIZACION_LABELS } from '@/lib/badge-variants'
import { formatUF } from '@/lib/uf'
import { formatearFecha } from '@/utils/formatear-fecha'
import { Download } from 'lucide-react'

function FilaResumen({
	label,
	children,
}: {
	label: string
	children: React.ReactNode
}) {
	return (
		<div>
			<dt className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
				{label}
			</dt>
			<dd className='mt-0.5 text-sm text-foreground'>{children}</dd>
		</div>
	)
}

function descargarPDF(base64: string, nombreArchivo: string) {
	const byteCharacters = atob(base64)
	const byteNumbers = new Array(byteCharacters.length)
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i)
	}
	const byteArray = new Uint8Array(byteNumbers)
	const blob = new Blob([byteArray], { type: 'application/pdf' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = nombreArchivo
	a.click()
	URL.revokeObjectURL(url)
}

type DialogVerCotizacionesProps = {
	fila: PanelEstudioFila
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function DialogVerCotizaciones({
	fila,
	open,
	onOpenChange,
}: DialogVerCotizacionesProps) {
	const { data: cotizaciones, isLoading } = useCotizaciones(fila.id)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='flex max-h-[90vh] w-[95vw] max-w-lg flex-col gap-0 p-0 lg:max-w-6xl'>
				<DialogHeader className='border-b border-border px-3 py-3 pr-10 sm:px-4 sm:pr-12'>
					<DialogTitle className='text-left text-sm leading-snug sm:text-base'>
						Cotizaciones recibidas
					</DialogTitle>
					<p className='text-left text-sm text-muted-foreground sm:text-xs'>
						Opciones de compañías aseguradoras para armar el estudio final.
					</p>
				</DialogHeader>

				<div className='border-b border-border/80 px-3 py-3 sm:px-4'>
					<dl className='grid grid-cols-2 gap-2 text-xs sm:gap-3 sm:text-sm'>
						<FilaResumen label='Cliente'>{fila.cliente}</FilaResumen>
						<FilaResumen label='Línea de seguro'>
							{fila.linea_seguro}
						</FilaResumen>
						<FilaResumen label='Ejecutivo comercial'>
							{fila.ejecutivo_comercial}
						</FilaResumen>
						<FilaResumen label='Opciones cotizadas'>
							{fila.cantidad_cotizaciones}
						</FilaResumen>
					</dl>
				</div>

				{isLoading ? (
					<div className='space-y-2 px-3 py-4 sm:px-4'>
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className='flex gap-4'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-4 w-20' />
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-4 w-20' />
								<Skeleton className='h-4 w-28' />
							</div>
						))}
					</div>
				) : cotizaciones && cotizaciones.length > 0 ? (
					<>
						{/* Mobile: cards */}
						<div className='space-y-2 overflow-y-auto px-3 py-3 lg:hidden'>
							{cotizaciones.map(cotizacion => {
								return (
									<div
										key={cotizacion.id}
										className='rounded-lg border border-border/70 bg-card p-3 text-xs'
									>
										<div className='mb-2 flex items-start justify-between gap-2'>
											<span className='text-sm font-medium text-foreground'>
												{cotizacion.company}
											</span>
											{cotizacion.estado && (
												<Badge
													variant={ESTADO_COTIZACION_VARIANT[cotizacion.estado]}
													className='text-xs font-medium'
												>
													{ESTADO_COTIZACION_LABELS[cotizacion.estado]}
												</Badge>
											)}
										</div>
										<div className='grid grid-cols-2 gap-x-3 gap-y-1.5 text-muted-foreground'>
											<div>
												<span className='text-xs uppercase tracking-wide'>
													Monto asegurado
												</span>
												<p className='tabular-nums text-foreground/90'>
													{formatUF(cotizacion.monto_total_asegurado)}
												</p>
											</div>
											<div>
												<span className='text-xs uppercase tracking-wide'>
													Prima afecta
												</span>
												<p className='tabular-nums text-foreground/90'>
													{cotizacion.prima_afecta
														? formatUF(cotizacion.prima_afecta)
														: '—'}
												</p>
											</div>
											<div>
												<span className='text-xs uppercase tracking-wide'>
													Prima excenta
												</span>
												<p className='tabular-nums text-foreground/90'>
													{cotizacion.prima_excenta
														? formatUF(cotizacion.prima_excenta)
														: '—'}
												</p>
											</div>
											<div>
												<span className='text-xs uppercase tracking-wide'>
													Prima neta
												</span>
												<p className='tabular-nums text-foreground/90'>
													{cotizacion.prima_neta
														? formatUF(cotizacion.prima_neta)
														: '—'}
												</p>
											</div>
											<div>
												<span className='text-xs uppercase tracking-wide'>
													Prima IVA
												</span>
												<p className='tabular-nums text-foreground/90'>
													{cotizacion.prima_iva
														? formatUF(cotizacion.prima_iva)
														: '—'}
												</p>
											</div>
											<div>
												<span className='text-xs uppercase tracking-wide'>
													Prima bruta
												</span>
												<p className='tabular-nums text-foreground/90'>
													{cotizacion.prima_bruta
														? formatUF(cotizacion.prima_bruta)
														: '—'}
												</p>
											</div>
											{cotizacion.nombre_archivo &&
												cotizacion.archivo_base64 && (
													<div className='col-span-2 mt-1'>
														<Button
															type='button'
															variant='outline'
															size='sm'
															className='h-7 w-full text-xs'
															onClick={() =>
																descargarPDF(
																	cotizacion.archivo_base64!,
																	cotizacion.nombre_archivo!,
																)
															}
														>
															<Download className='mr-1 h-3 w-3' />
															Descargar PDF
														</Button>
													</div>
												)}
										</div>
									</div>
								)
							})}
						</div>

						{/* Desktop: table */}
						<ScrollArea className='hidden max-h-[min(55vh,420px)] overflow-x-auto lg:block'>
							<Table className='w-full'>
								<TableHeader>
									<TableRow className='border-border/50 hover:bg-muted/25'>
										<TableHead className='whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											Compañía
										</TableHead>
										<TableHead className='whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											Monto asegurado
										</TableHead>
										<TableHead className='whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											Prima afecta
										</TableHead>
										<TableHead className='whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											Prima excenta
										</TableHead>
										<TableHead className='whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											Prima neta
										</TableHead>
										<TableHead className='whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											Prima IVA
										</TableHead>
										<TableHead className='whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											Prima bruta
										</TableHead>
										<TableHead className='whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											Emisión
										</TableHead>
										<TableHead className='whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											Vencimiento
										</TableHead>
										<TableHead className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											Estado venc.
										</TableHead>
										<TableHead className='w-10'></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{cotizaciones.map(cotizacion => {
										return (
											<TableRow
												key={cotizacion.id}
												className='border-border/40 hover:bg-muted/20'
											>
												<TableCell className='max-w-35 whitespace-nowrap text-sm text-foreground'>
													{cotizacion.company}
												</TableCell>
												<TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
													{formatUF(cotizacion.monto_total_asegurado)}
												</TableCell>
												<TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
													{cotizacion.prima_afecta
														? formatUF(cotizacion.prima_afecta)
														: '—'}
												</TableCell>
												<TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
													{cotizacion.prima_excenta
														? formatUF(cotizacion.prima_excenta)
														: '—'}
												</TableCell>
												<TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
													{cotizacion.prima_neta
														? formatUF(cotizacion.prima_neta)
														: '—'}
												</TableCell>
												<TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
													{cotizacion.prima_iva
														? formatUF(cotizacion.prima_iva)
														: '—'}
												</TableCell>
												<TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
													{cotizacion.prima_bruta
														? formatUF(cotizacion.prima_bruta)
														: '—'}
												</TableCell>
												<TableCell className='whitespace-nowrap text-xs text-muted-foreground'>
													{formatearFecha(
														new Date(cotizacion.fecha_emision),
														'dd-MM-yyyy',
													)}
												</TableCell>
												<TableCell className='whitespace-nowrap text-xs text-muted-foreground'>
													{formatearFecha(
														new Date(cotizacion.fecha_vencimiento),
														'dd-MM-yyyy',
													)}
												</TableCell>
												<TableCell className='py-2'>
													{cotizacion.estado && (
														<Badge
															variant={ESTADO_COTIZACION_VARIANT[cotizacion.estado]}
															className='text-xs font-medium'
														>
															{ESTADO_COTIZACION_LABELS[cotizacion.estado]}
														</Badge>
													)}
												</TableCell>
												<TableCell className='py-2'>
													{cotizacion.nombre_archivo &&
														cotizacion.archivo_base64 && (
															<button
																type='button'
																className='text-muted-foreground hover:text-foreground'
																title='Descargar PDF'
																onClick={() =>
																	descargarPDF(
																		cotizacion.archivo_base64!,
																		cotizacion.nombre_archivo!,
																	)
																}
															>
																<Download className='h-3.5 w-3.5' />
															</button>
														)}
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</ScrollArea>
					</>
				) : (
					<p className='px-4 py-6 text-center text-sm text-muted-foreground'>
						No hay cotizaciones registradas para esta solicitud.
					</p>
				)}

				<DialogFooter className='border-t border-border px-3 py-3 sm:px-4'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() => onOpenChange(false)}
					>
						Cerrar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
