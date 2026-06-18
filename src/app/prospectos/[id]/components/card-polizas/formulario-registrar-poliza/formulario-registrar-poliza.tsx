import { Button } from '@/components/button'
import Input from '@/components/forms/input/input'
import Label from '@/components/forms/label/label'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import Textarea from '@/components/forms/text-area/text-area'
import { ScrollArea } from '@/components/scroll-area'
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/sheet'
import { classname } from '@/lib/class-name'
import { inputPendiente } from '@/utils/input/input-pendiente'
import { Upload, X, Loader2 } from 'lucide-react'
import { inp } from '../../card-informacion-prospecto/formulario-actualizar-prospecto/formulario-actualizar-prospecto'
import { Sheet } from '@/components/sheet'

type FormularioRegistrarPolizaProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function FormularioRegistrarPoliza({
	open,
	onOpenChange,
}: FormularioRegistrarPolizaProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			{/**<SheetContent
				className='flex w-full flex-col sm:max-w-md'
				aria-describedby={undefined}
			>
				<SheetHeader>
					<SheetTitle>Registrar póliza</SheetTitle>
				</SheetHeader>

				<>
					<ScrollArea className='max-h-[calc(100vh-220px)] flex-1 pr-3'>
						<div className='space-y-4 pb-4'>
							<div className='rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed'>
								<p>
									<span className='text-muted-foreground'>Cliente:</span>{' '}
									<span className='font-medium text-foreground'>
										{nombreCliente}
									</span>
								</p>
								<p className='mt-2 text-[10px] text-muted-foreground'>
									La fecha y hora de registro se guardan automáticamente al
									confirmar.
								</p>
							</div>

							<div className='space-y-1.5'>
								<Label
									className={classname(
										'text-xs',
										true && 'text-amber-800 dark:text-amber-200',
									)}
								>
									Línea de seguro asociada
								</Label>
								<SelectorLineaSeguroAsociada
										opciones={opcionesLineaPoliza}
										value={lineaPolizaId}
										onValueChange={v => {
											setLineaPolizaId(v)
											setErrorValidacionLineaPoliza(null)
											if (polInicio)
												setPolFin(finPredeterminadoUnAnoDesde(polInicio))
										}}
									/> 
								{true ? (
									<p className='text-[10px] text-destructive'>ERROR</p>
								) : (
									<p className='text-[10px] text-muted-foreground'>
										Debe asociarse a una línea de seguro del cliente.
									</p>
								)}
							</div>

							<div className='space-y-1.5'>
								<Label
									className={classname(
										'text-xs',
										inputPendiente(polNumero) &&
											'text-amber-800 dark:text-amber-200',
									)}
								>
									Número de póliza
								</Label>
								<Input
									className={inp(inputPendiente(polNumero))}
									value={polNumero}
									onChange={e => setPolNumero(e.target.value)}
									placeholder='Ej. POL-2026-88421'
								/>
							</div>

							<div className='space-y-1.5'>
								<Label
									className={classname(
										'text-xs',
										inputPendiente(polCompania) &&
											'text-amber-800 dark:text-amber-200',
									)}
								>
									Compañía aseguradora
								</Label>
								<Input
									className={inp(inputPendiente(polCompania))}
									value={polCompania}
									onChange={e => setPolCompania(e.target.value)}
									placeholder='Nombre de la compañía'
								/>
							</div>

							<div className='space-y-1.5'>
								<Label className='text-xs'>Estado de póliza</Label>
								<Select value={polEstado} onValueChange={setPolEstado}>
									<SelectTrigger className='h-9 text-sm shadow-none'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{ESTADOS_POLIZA_FORMULARIO.map(e => (
											<SelectItem key={e} value={e} className='text-xs'>
												{e}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<p className='text-[10px] text-muted-foreground'>
									«Por vencer» y «Vencida» se calculan según la fecha de término
									de vigencia.
								</p>
							</div>

							<div className='grid gap-3 sm:grid-cols-2'>
								<div className='space-y-1.5'>
									<Label className='text-xs'>Fecha de inicio de vigencia</Label>
									<Input
										type='date'
										className='h-9 text-sm shadow-none'
										value={polInicio}
										onChange={e => {
											setPolInicio(e.target.value)
											if (e.target.value)
												setPolFin(finPredeterminadoUnAnoDesde(e.target.value))
										}}
									/>
								</div>
								<div className='space-y-1.5'>
									<Label className='text-xs'>
										Fecha de término / vencimiento
									</Label>
									<Input
										type='date'
										className='h-9 text-sm shadow-none'
										value={polFin}
										onChange={e => setPolFin(e.target.value)}
									/>
								</div>
							</div>
							{fechasPolizaOrdenInvalido ? (
								<p className='text-[10px] text-destructive'>
									La fecha de término debe ser igual open posterior al inicio.
								</p>
							) : null}

							<div className='space-y-1.5'>
								<Label className='text-xs'>Prima open monto (opcional)</Label>
								<Input
									className='h-9 text-sm shadow-none'
									inputMode='decimal'
									value={polPrima}
									onChange={e => setPolPrima(e.target.value)}
									placeholder='Ej. UF 120 open $ 2.500.000'
								/>
							</div>

							<div className='space-y-1.5'>
								<Label className='text-xs' htmlFor='poliza-adjuntos-input'>
									Documentos de respaldo (opcional)
								</Label>
								<input
									id='poliza-adjuntos-input'
									ref={polArchivosInputRef}
									type='file'
									className='sr-only'
									accept={ACEPTACION_ARCHIVOS_POLIZA}
									multiple
									onChange={e => {
										const list = e.target.files
										if (!list?.length) return
										setPolArchivos(prev => [...prev, ...Array.from(list)])
										e.target.value = ''
									}}
								/>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-9 gap-2 text-xs'
									onClick={() => polArchivosInputRef.current?.click()}
								>
									<Upload className='h-3.5 w-3.5' aria-hidden />
									Elegir archivos
								</Button>
								{polArchivos.length > 0 ? (
									<ul className='space-y-1.5 rounded-md border border-border bg-muted/20 p-2'>
										{polArchivos.map((f, i) => (
											<li
												key={`${f.name}-${i}-${f.size}`}
												className='flex items-center gap-2 text-xs'
											>
												<span className='min-w-0 flex-1 break-all leading-snug text-foreground'>
													{f.name}
												</span>
												<span className='shrink-0 text-[10px] tabular-nums text-muted-foreground'>
													{formatoTamanoArchivo(f.size)}
												</span>
												<Button
													type='button'
													variant='ghost'
													size='sm'
													className='h-7 w-7 shrink-0 p-0'
													onClick={() =>
														setPolArchivos(prev =>
															prev.filter((_, j) => j !== i),
														)
													}
													aria-label={`Quitar ${f.name}`}
												>
													<X className='h-3.5 w-3.5' aria-hidden />
												</Button>
											</li>
										))}
									</ul>
								) : null}
							</div>

							<div className='space-y-1.5'>
								<Label className='text-xs'>Observaciones</Label>
								<Textarea
									className='min-h-[72px] resize-y text-sm shadow-none'
									placeholder='Notas internas...'
									value={polObs}
									onChange={e => setPolObs(e.target.value)}
								/>
							</div>
						</div>
					</ScrollArea>

					<SheetFooter className='border-t border-border pt-3 sm:flex-col'>
						<div className='flex w-full flex-col gap-2 sm:flex-row sm:justify-end'>
							<Button
								type='button'
								variant='outline'
								className='w-full sm:w-auto'
								onClick={() => setSheetAbierto(false)}
							>
								Cancelar
							</Button>
							<Button
								type='button'
								className='w-full gap-2 sm:w-auto'
								disabled={guardandoPoliza}
								onClick={intentarGuardarPoliza}
							>
								{guardandoPoliza ? (
									<Loader2 className='h-4 w-4 animate-spin' aria-hidden />
								) : null}
								Guardar póliza
							</Button>
						</div>
					</SheetFooter>
				</>
			</SheetContent> */}
		</Sheet>
	)
}
