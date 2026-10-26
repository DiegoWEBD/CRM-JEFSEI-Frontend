'use client'

import type {
	AlicuotaOportunidadResponse,
	DesgloseReconstruccionResponse,
} from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/alert-dialog'
import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import type { CambiosUnidadesAlicuota } from '@/hooks/importacion-alicuotas/use-cambios-unidades-alicuota'
import { formatUF } from '@/lib/uf'
import { formatearProrrateoPorcentaje } from '@/utils/formatear-prorrateo'
import { Ban, Loader2, RotateCcw, Save } from 'lucide-react'
import { useState } from 'react'

type DialogDetalleAlicuotaProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	data: AlicuotaOportunidadResponse
	desglose: DesgloseReconstruccionResponse | undefined
	cambios: CambiosUnidadesAlicuota
}

export default function DialogDetalleAlicuota({
	open,
	onOpenChange,
	data,
	desglose,
	cambios,
}: DialogDetalleAlicuotaProps) {
	const [confirmacionAbierta, setConfirmacionAbierta] = useState(false)

	const desgloseCalculado = desglose?.desglose_calculado === true
	const puedeAdministrar = data.puede_administrar_alicuota === true

	function solicitarCierre() {
		if (cambios.guardando) return

		if (cambios.cantidadCambios > 0) {
			setConfirmacionAbierta(true)
			return
		}

		onOpenChange(false)
	}

	async function guardarYCerrar() {
		if (await cambios.guardarCambios()) {
			setConfirmacionAbierta(false)
			onOpenChange(false)
		}
	}

	function descartarYCerrar() {
		cambios.descartarCambios()
		setConfirmacionAbierta(false)
		onOpenChange(false)
	}

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={value => (value ? onOpenChange(true) : solicitarCierre())}
			>
				<DialogContent className='flex max-h-[90vh] w-[95vw] max-w-lg flex-col gap-0 p-0 lg:max-w-6xl'>
					<DialogHeader className='border-b border-border px-3 py-3 pr-10 sm:px-4 sm:pr-12'>
						<DialogTitle className='text-left text-sm leading-snug sm:text-base'>
							Alícuota — {data.nombre_excel}
						</DialogTitle>
						<p className='text-left text-xs text-muted-foreground'>
							{data.cantidad} unidades
							{cambios.totales.cantidadDescartadas > 0
								? ` (${cambios.totales.cantidadDescartadas} descartadas)`
								: ''}
							{cambios.cantidadCambios > 0 ? (
								<span className='text-amber-600'>
									{' · '}
									{cambios.cantidadCambios}{' '}
									{cambios.cantidadCambios === 1
										? 'cambio sin guardar'
										: 'cambios sin guardar'}
								</span>
							) : null}
						</p>
					</DialogHeader>

					<div className='min-h-0 flex-1 space-y-2 overflow-auto px-3 py-3 sm:px-4'>
						{desgloseCalculado ? (
							<div className='flex items-center justify-between rounded-md border border-border/70 bg-card px-2.5 py-1.5'>
								<p className='text-xs text-muted-foreground'>
									Monto asegurado total
									{cambios.totales.montoSugerido !==
									cambios.totales.montoAsegurado ? (
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
								reconstrucción del prospecto (m², UF/m² y depreciación). Los
								montos asegurados personalizados que fije aquí se aplicarán al
								cálculo.
							</p>
						)}

						{data.cantidad > 0 ? (
							<div className='overflow-auto rounded-md border border-border/70 bg-card'>
								<table className='w-full min-w-215 table-fixed text-xs'>
									<thead className='sticky top-0 bg-card'>
										<tr className='border-b border-border/70 text-muted-foreground'>
											<th className='w-[24%] px-2 py-1.5 text-left font-medium'>
												Unidad
											</th>
											<th className='w-[11%] px-2 py-1.5 text-right font-medium'>
												Prorrateo alícuota
											</th>
											{desgloseCalculado ? (
												<>
													<th className='w-[14%] px-2 py-1.5 text-right font-medium'>
														Monto reconstrucción
													</th>
													<th className='w-[12%] px-2 py-1.5 text-right font-medium'>
														Monto sugerido
													</th>
												</>
											) : null}
											<th className='w-[13%] px-2 py-1.5 text-right font-medium'>
												Monto asegurado
											</th>
											{puedeAdministrar ? (
												<th className='w-[26%] px-2 py-1.5 text-right font-medium'>
													Acciones
												</th>
											) : null}
										</tr>
									</thead>
									<tbody>
										{data.unidades.map(unidad => {
											const calculado = cambios.desgloseDe(unidad)
											const cambiosUnidad = cambios.cambiosDe(unidad)
											const descartada = cambios.descartadaEfectiva(unidad)
											const personalizado =
												cambios.montoPersonalizadoEfectivoDe(unidad) != null ||
												(cambiosUnidad?.monto_asegurado_personalizado ===
													undefined &&
													calculado?.tiene_monto_asegurado_personalizado ===
														true)
											const textoMonto =
												unidad.id != null
													? cambios.montosEditando[unidad.id]
													: undefined
											const montoInvalido =
												textoMonto !== undefined &&
												textoMonto.trim() !== '' &&
												(!Number.isFinite(Number(textoMonto.trim())) ||
													Number(textoMonto.trim()) <= 0)
											const usarSugeridoVisible = personalizado

											return (
												<tr
													key={
														unidad.id ??
														`${unidad.fila_origen}-${unidad.identificador_unidad}`
													}
													className={`border-b border-border/50 last:border-b-0 ${
														descartada ? 'opacity-50' : ''
													} ${cambiosUnidad != null ? 'bg-primary/5' : ''}`}
												>
													<td className='px-2 py-1.5 font-medium text-foreground'>
														{unidad.identificador_unidad}
														{cambiosUnidad != null ? (
															<span className='ml-1.5 rounded bg-amber-500/10 px-1 py-0.5 text-[10px] font-medium text-amber-600'>
																Sin guardar
															</span>
														) : null}
														{descartada ? (
															<span className='ml-1.5 rounded bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground'>
																Descartada
															</span>
														) : personalizado ? (
															<span className='ml-1.5 rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary'>
																Personalizado
															</span>
														) : null}
													</td>
													<td className='px-2 py-1.5 text-right text-muted-foreground'>
														{formatearProrrateoPorcentaje(unidad.prorrateo)}
													</td>

													{desgloseCalculado ? (
														<>
															<td className='px-2 py-1.5 text-right text-muted-foreground'>
																{descartada
																	? '—'
																	: formatUF(
																			Number(
																				calculado?.monto_reconstruccion.toFixed(
																					2,
																				),
																			) ?? null,
																		)}
															</td>
															<td className='px-2 py-1.5 text-right text-muted-foreground'>
																{descartada
																	? '—'
																	: formatUF(
																			calculado?.monto_asegurado_sugerido ??
																				null,
																		)}
															</td>
														</>
													) : null}

													<td className='px-2 py-1.5 text-right'>
														{puedeAdministrar && unidad.id != null ? (
															<input
																type='number'
																min={0}
																step='any'
																className={`h-6 w-24 rounded border bg-background px-1.5 text-right text-xs text-foreground focus:outline-none focus:ring-1 ${
																	montoInvalido
																		? 'border-red-500 focus:ring-red-500'
																		: 'border-border/70 focus:ring-primary'
																}`}
																placeholder={
																	calculado
																		? String(calculado.monto_asegurado_sugerido)
																		: 'Sugerido'
																}
																value={cambios.montoVisible(unidad)}
																disabled={cambios.guardando}
																onChange={event =>
																	cambios.cambiarMonto(
																		unidad,
																		event.target.value,
																	)
																}
															/>
														) : (
															<span
																className={
																	descartada
																		? 'text-muted-foreground'
																		: 'text-foreground'
																}
															>
																{descartada
																	? '—'
																	: formatUF(
																			calculado?.monto_asegurado ??
																				unidad.monto_asegurado_personalizado ??
																				null,
																		)}
															</span>
														)}
													</td>

													{puedeAdministrar && unidad.id != null ? (
														<td className='px-2 py-1.5 text-right'>
															<div className='flex items-center justify-end gap-1'>
																{/* Espacio reservado: el botón se renderiza siempre para que
																    la columna no cambie de ancho al fijar un monto. */}
																<Button
																	type='button'
																	variant='ghost'
																	size='sm'
																	className={`h-6 gap-1 px-1.5 text-[11px] text-muted-foreground shadow-none ${
																		usarSugeridoVisible ? '' : 'invisible'
																	}`}
																	aria-hidden={!usarSugeridoVisible}
																	tabIndex={
																		usarSugeridoVisible ? undefined : -1
																	}
																	disabled={cambios.guardando}
																	onClick={() => cambios.usarSugerido(unidad)}
																>
																	<RotateCcw className='h-3 w-3' aria-hidden />
																	Usar sugerido
																</Button>

																<Button
																	type='button'
																	variant='ghost'
																	size='sm'
																	className='h-6 gap-1 px-1.5 text-[11px] text-muted-foreground shadow-none'
																	disabled={cambios.guardando}
																	onClick={() =>
																		cambios.alternarDescarte(unidad)
																	}
																>
																	{descartada ? (
																		<>
																			<RotateCcw
																				className='h-3 w-3'
																				aria-hidden
																			/>
																			Restaurar
																		</>
																	) : (
																		<>
																			<Ban className='h-3 w-3' aria-hidden />
																			Descartar
																		</>
																	)}
																</Button>
															</div>
														</td>
													) : null}
												</tr>
											)
										})}

										<tr className='bg-muted/40 font-semibold'>
											<td className='px-2 py-1.5 text-foreground'>
												TOTAL
												{cambios.totales.cantidadDescartadas > 0 ? (
													<span className='ml-1 text-[10px] font-normal text-muted-foreground'>
														(solo unidades activas)
													</span>
												) : null}
											</td>
											<td className='px-2 py-1.5 text-right text-foreground'>
												{formatearProrrateoPorcentaje(
													cambios.totales.prorrateoActivo,
												)}
											</td>

											{desgloseCalculado ? (
												<>
													<td className='px-2 py-1.5 text-right text-foreground'>
														{formatUF(
															Math.round(cambios.totales.montoReconstruccion),
														)}
													</td>
													<td className='px-2 py-1.5 text-right text-foreground'>
														{formatUF(cambios.totales.montoSugerido)}
													</td>
												</>
											) : null}

											<td className='px-2 py-1.5 text-right text-foreground'>
												{desgloseCalculado
													? formatUF(cambios.totales.montoAsegurado)
													: '—'}
											</td>

											{puedeAdministrar ? <td className='px-2 py-1.5' /> : null}
										</tr>
									</tbody>
								</table>
							</div>
						) : null}
					</div>

					<DialogFooter className='border-t border-border px-3 py-3 sm:px-4'>
						<div className='flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
							<p className='text-xs text-muted-foreground'>
								{cambios.cantidadCambios > 0
									? 'Los cambios se aplican al guardar (todo o nada).'
									: 'Sin cambios pendientes.'}
							</p>

							<div className='flex flex-col gap-2 sm:flex-row'>
								{puedeAdministrar && cambios.cantidadCambios > 0 ? (
									<>
										<Button
											type='button'
											variant='outline'
											size='sm'
											className='h-7 gap-1 text-xs shadow-none'
											onClick={cambios.descartarCambios}
											disabled={cambios.guardando}
										>
											Descartar cambios
										</Button>
										<Button
											type='button'
											size='sm'
											className='h-7 gap-1 text-xs shadow-none'
											onClick={() => cambios.guardarCambios()}
											disabled={cambios.guardando}
										>
											{cambios.guardando ? (
												<>
													<Loader2
														className='h-3 w-3 animate-spin'
														aria-hidden
													/>
													Guardando...
												</>
											) : (
												<>
													<Save className='h-3 w-3' aria-hidden />
													Guardar ({cambios.cantidadCambios})
												</>
											)}
										</Button>
									</>
								) : null}

								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-7 gap-1 text-xs shadow-none'
									onClick={solicitarCierre}
									disabled={cambios.guardando}
								>
									Cerrar
								</Button>
							</div>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={confirmacionAbierta}
				onOpenChange={setConfirmacionAbierta}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Tienes cambios sin guardar</AlertDialogTitle>
						<AlertDialogDescription>
							Los cambios realizados en las unidades de la alícuota no se han
							guardado. ¿Qué deseas hacer?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
						<AlertDialogCancel disabled={cambios.guardando}>
							Seguir editando
						</AlertDialogCancel>
						<Button
							type='button'
							variant='outline'
							onClick={descartarYCerrar}
							disabled={cambios.guardando}
						>
							Descartar cambios y cerrar
						</Button>
						<Button
							type='button'
							onClick={guardarYCerrar}
							disabled={cambios.guardando}
						>
							{cambios.guardando ? (
								<>
									<Loader2 className='h-3 w-3 animate-spin' aria-hidden />
									Guardando...
								</>
							) : (
								'Guardar y cerrar'
							)}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
