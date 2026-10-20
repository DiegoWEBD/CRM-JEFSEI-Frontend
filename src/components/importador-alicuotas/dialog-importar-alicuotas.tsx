'use client'

import type {
	AnalizarAlicuotasResponse,
	ConfiguracionImportacionAlicuotas,
	ImportacionAlicuotasResultado,
	ValidarAlicuotasResponse,
} from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import GrillaVistaPreviaExcel, {
	letraColumna,
} from './grilla-vista-previa-excel'
import TablaRegistrosAlicuotas from './tabla-registros-alicuotas'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { RadioGroup, RadioGroupItem } from '@/components/radio-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { useAnalizarAlicuotas } from '@/hooks/importacion-alicuotas/use-analizar-alicuotas'
import { useValidarAlicuotas } from '@/hooks/importacion-alicuotas/use-validar-alicuotas'
import { validarTamanoArchivo } from '@/lib/archivos'
import { formatearProrrateoPorcentaje } from '@/utils/formatear-prorrateo'
import { Badge } from '@/components/badge'
import { Loader2, Upload } from 'lucide-react'
import { useMemo, useRef, useState, type ReactNode } from 'react'

const PASOS = ['Archivo', 'Hoja y configuración', 'Registros', 'Resumen']

const INTERPRETACIONES = [
	{ value: 'valor_porcentual', label: 'Porcentaje directo (0,85 = 0,85 %)' },
	{ value: 'fraccion_decimal', label: 'Fracción decimal (0,0085 = 0,85 %)' },
	{ value: 'porcentaje_excel', label: 'Formato de porcentaje de Excel' },
]

type OpcionSelect = {
	valor: string
	etiqueta: ReactNode
}

function opcionesFilas(total: number): OpcionSelect[] {
	return Array.from({ length: total }, (_, indice) => ({
		valor: String(indice + 1),
		etiqueta: String(indice + 1),
	}))
}

function opcionesColumnas(total: number): OpcionSelect[] {
	return Array.from({ length: total }, (_, indice) => ({
		valor: String(indice + 1),
		etiqueta: letraColumna(indice + 1),
	}))
}

function CampoSelect({
	etiqueta,
	valor,
	opciones,
	ancho = 'w-36',
	onCambio,
}: {
	etiqueta: string
	valor: number
	opciones: OpcionSelect[]
	ancho?: string
	onCambio: (valor: number) => void
}) {
	return (
		<div className='space-y-1.5'>
			<Label className='text-xs'>{etiqueta}</Label>
			<Select value={String(valor)} onValueChange={v => onCambio(Number(v))}>
				<SelectTrigger className={`h-9 ${ancho} text-sm shadow-none`}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{opciones.map(opcion => (
						<SelectItem
							key={opcion.valor}
							value={opcion.valor}
							className='text-sm'
						>
							{opcion.etiqueta}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

function mensajeError(error: unknown): string {
	if (error && typeof error === 'object' && 'response' in error) {
		const data = (
			error as { response?: { data?: { detail?: string; message?: string } } }
		).response?.data
		if (data?.detail) return data.detail
		if (data?.message) return data.message
	}
	return error instanceof Error ? error.message : 'Error inesperado'
}

type DialogImportarAlicuotasProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirmar: (resultado: ImportacionAlicuotasResultado) => void
}

export default function DialogImportarAlicuotas({
	open,
	onOpenChange,
	onConfirmar,
}: DialogImportarAlicuotasProps) {
	const [paso, setPaso] = useState(0)
	const [archivo, setArchivo] = useState<File | null>(null)
	const [errorArchivo, setErrorArchivo] = useState<string | null>(null)
	const [analisis, setAnalisis] = useState<AnalizarAlicuotasResponse | null>(
		null,
	)
	const [validacion, setValidacion] = useState<ValidarAlicuotasResponse | null>(
		null,
	)
	const [config, setConfig] = useState<ConfiguracionImportacionAlicuotas>({
		hoja: '',
		fila_encabezados: 1,
		columna_identificador: 1,
		columna_prorrateo: 2,
		primera_fila: 2,
		ultima_fila: 2,
		interpretacion_prorrateo: null,
	})
	const inputArchivoRef = useRef<HTMLInputElement>(null)

	const analizarMutation = useAnalizarAlicuotas()
	const validarMutation = useValidarAlicuotas()

	function reiniciar() {
		setPaso(0)
		setArchivo(null)
		setErrorArchivo(null)
		setAnalisis(null)
		setValidacion(null)
		analizarMutation.reset()
		validarMutation.reset()
		if (inputArchivoRef.current) inputArchivoRef.current.value = ''
	}

	function handleOpenChange(siguiente: boolean) {
		if (!siguiente) reiniciar()
		onOpenChange(siguiente)
	}

	function aplicarSugerencias(data: AnalizarAlicuotasResponse) {
		const sugerencias = data.sugerencias
		const filaEncabezados = sugerencias.fila_encabezados ?? 1

		setConfig({
			hoja: data.hoja_seleccionada,
			fila_encabezados: filaEncabezados,
			columna_identificador: sugerencias.columna_identificador ?? 1,
			columna_prorrateo: sugerencias.columna_prorrateo ?? 2,
			primera_fila: filaEncabezados + 1,
			ultima_fila: data.filas,
			interpretacion_prorrateo: null,
		})
	}

	function analizar(hoja?: string) {
		if (!archivo) return

		analizarMutation.mutate(
			{ archivo, opciones: hoja ? { hoja } : {} },
			{
				onSuccess: data => {
					setAnalisis(data)
					setValidacion(null)
					aplicarSugerencias(data)
					setPaso(1)
				},
			},
		)
	}

	function handleArchivoSeleccionado(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const seleccionado = event.target.files?.[0]
		if (!seleccionado) return

		const errorTamano = validarTamanoArchivo(seleccionado)
		if (errorTamano) {
			setErrorArchivo(errorTamano)
			setArchivo(null)
			return
		}

		if (!seleccionado.name.toLowerCase().endsWith('.xlsx')) {
			setErrorArchivo('Solo se permiten archivos Excel (.xlsx)')
			setArchivo(null)
			return
		}

		setErrorArchivo(null)
		setArchivo(seleccionado)
		setAnalisis(null)
		setValidacion(null)
		analizarMutation.reset()
		validarMutation.reset()
	}

	function handleCambioConfig(
		campo: keyof ConfiguracionImportacionAlicuotas,
		valor: number,
	) {
		setConfig(prev => ({ ...prev, [campo]: valor }))
		setValidacion(null)
	}

	function handleSeleccionarFila(fila: number) {
		setConfig(prev => {
			if (fila < prev.primera_fila) return { ...prev, primera_fila: fila }
			return { ...prev, ultima_fila: fila }
		})
		setValidacion(null)
	}

	function validar(configuracion: ConfiguracionImportacionAlicuotas) {
		if (!archivo) return

		validarMutation.mutate(
			{ archivo, configuracion },
			{
				onSuccess: data => {
					setValidacion(data)
					setPaso(2)
				},
			},
		)
	}

	function handleInterpretacion(valor: string) {
		const nuevaConfig = { ...config, interpretacion_prorrateo: valor }
		setConfig(nuevaConfig)
		validar(nuevaConfig)
	}

	function confirmar() {
		if (!archivo || !validacion) return

		const unidades = validacion.registros
			.filter(
				registro => registro.estado === 'valido' && registro.prorrateo != null,
			)
			.map(registro => ({
				identificador_unidad: registro.identificador_unidad,
				prorrateo: registro.prorrateo as number,
				fila_origen: registro.fila_origen,
			}))

		onConfirmar({
			nombreExcel: archivo.name,
			unidades,
			cantidadUnidades: unidades.length,
			sumaProrrateos: validacion.suma_prorrateos,
			cantidadAdvertencias: validacion.problemas.filter(
				problema => problema.severidad === 'advertencia',
			).length,
			hoja: config.hoja,
			filaEncabezados: config.fila_encabezados,
			columnaIdentificador: config.columna_identificador,
			columnaProrrateo: config.columna_prorrateo,
			primeraFila: config.primera_fila,
			ultimaFila: config.ultima_fila,
		})

		handleOpenChange(false)
	}

	const opcionesFilaEncabezados = useMemo<OpcionSelect[]>(() => {
		const sugerida = analisis?.sugerencias.fila_encabezados
		return opcionesFilas(analisis?.filas ?? 0).map(opcion =>
			sugerida != null && opcion.valor === String(sugerida)
				? {
						...opcion,
						etiqueta: (
							<span className='flex items-center gap-1.5'>
								{opcion.etiqueta}
								<Badge variant='info' className='px-1.5 text-[10px]'>
									sugerida
								</Badge>
							</span>
						),
					}
				: opcion,
		)
	}, [analisis?.filas, analisis?.sugerencias.fila_encabezados])

	const opcionesPrimeraFila = useMemo<OpcionSelect[]>(
		() => opcionesFilas(analisis?.filas ?? 0),
		[analisis?.filas],
	)

	const opcionesUltimaFila = useMemo<OpcionSelect[]>(
		() => opcionesFilas(analisis?.filas ?? 0),
		[analisis?.filas],
	)

	const opcionesColumnaIdentificador = useMemo<OpcionSelect[]>(() => {
		const sugerida = analisis?.sugerencias.columna_identificador
		return opcionesColumnas(analisis?.columnas ?? 0).map(opcion =>
			sugerida != null && opcion.valor === String(sugerida)
				? {
						...opcion,
						etiqueta: (
							<span className='flex items-center gap-1.5'>
								{opcion.etiqueta}
								<Badge variant='info' className='px-1.5 text-[10px]'>
									sugerida
								</Badge>
							</span>
						),
					}
				: opcion,
		)
	}, [analisis?.columnas, analisis?.sugerencias.columna_identificador])

	const opcionesColumnaProrrateo = useMemo<OpcionSelect[]>(() => {
		const sugerida = analisis?.sugerencias.columna_prorrateo
		return opcionesColumnas(analisis?.columnas ?? 0).map(opcion =>
			sugerida != null && opcion.valor === String(sugerida)
				? {
						...opcion,
						etiqueta: (
							<span className='flex items-center gap-1.5'>
								{opcion.etiqueta}
								<Badge variant='info' className='px-1.5 text-[10px]'>
									sugerida
								</Badge>
							</span>
						),
					}
				: opcion,
		)
	}, [analisis?.columnas, analisis?.sugerencias.columna_prorrateo])

	const puedeValidar =
		!!archivo &&
		config.columna_identificador !== config.columna_prorrateo &&
		config.primera_fila > config.fila_encabezados &&
		config.ultima_fila >= config.primera_fila

	const puedeContinuar =
		!!validacion &&
		!validacion.tiene_errores_bloqueantes &&
		!validacion.confirmacion_requerida &&
		validacion.cantidad_registros > 0

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-h-[min(92vh,860px)] sm:max-w-5xl gap-4 overflow-y-auto overflow-x-hidden'>
				<DialogHeader className='space-y-0'>
					<DialogTitle>Importar alícuotas desde Excel</DialogTitle>
				</DialogHeader>

				<div className='flex items-center gap-2'>
					{PASOS.map((nombre, indice) => (
						<div key={nombre} className='flex items-center gap-2'>
							<span
								className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
									indice === paso
										? 'bg-primary text-primary-foreground'
										: indice < paso
											? 'bg-success/20 text-success'
											: 'bg-muted text-muted-foreground'
								}`}
							>
								{indice + 1}
							</span>
							<span
								className={`text-xs ${indice === paso ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
							>
								{nombre}
							</span>
							{indice < PASOS.length - 1 && (
								<span className='h-px w-6 bg-border' aria-hidden />
							)}
						</div>
					))}
				</div>

				{paso === 0 && (
					<div className='min-w-0 space-y-3'>
						<div className='space-y-1.5'>
							<Label className='text-xs'>Archivo Excel (.xlsx)</Label>
							<Input
								ref={inputArchivoRef}
								type='file'
								accept='.xlsx'
								className='h-9 text-sm shadow-none'
								onChange={handleArchivoSeleccionado}
							/>
							<p className='text-xs text-muted-foreground'>
								El archivo lo entrega el administrador de la comunidad. No se
								modifican sus datos.
							</p>
							{(errorArchivo || analizarMutation.isError) && (
								<p
									className='text-xs font-medium text-destructive'
									role='alert'
								>
									{errorArchivo ?? mensajeError(analizarMutation.error)}
								</p>
							)}
						</div>

						{archivo && (
							<p className='rounded-md border border-border bg-muted/15 px-3 py-2 text-sm text-foreground'>
								{archivo.name} · {Math.max(1, Math.round(archivo.size / 1024))}{' '}
								KB
							</p>
						)}
					</div>
				)}

				{paso === 1 && analisis && (
					<div className='min-w-0 space-y-3'>
						<div className='flex flex-wrap items-end gap-3'>
							<div className='space-y-1.5'>
								<Label className='text-xs'>Hoja</Label>
								<Select
									value={config.hoja}
									onValueChange={valor => analizar(valor)}
								>
									<SelectTrigger className='h-9 w-56 text-sm shadow-none'>
										<SelectValue placeholder='Seleccione la hoja' />
									</SelectTrigger>
									<SelectContent>
										{analisis.hojas.map(hoja => (
											<SelectItem
												key={hoja.nombre}
												value={hoja.nombre}
												className='text-sm'
											>
												{hoja.nombre} ({hoja.filas} × {hoja.columnas})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<CampoSelect
								etiqueta='Fila de encabezados'
								valor={config.fila_encabezados}
								opciones={opcionesFilaEncabezados}
								ancho='w-44'
								onCambio={valor =>
									handleCambioConfig('fila_encabezados', valor)
								}
							/>

							<CampoSelect
								etiqueta='Columna identificador'
								valor={config.columna_identificador}
								opciones={opcionesColumnaIdentificador}
								ancho='w-36'
								onCambio={valor =>
									handleCambioConfig('columna_identificador', valor)
								}
							/>

							<CampoSelect
								etiqueta='Columna prorrateo'
								valor={config.columna_prorrateo}
								opciones={opcionesColumnaProrrateo}
								ancho='w-36'
								onCambio={valor =>
									handleCambioConfig('columna_prorrateo', valor)
								}
							/>

							<CampoSelect
								etiqueta='Primera fila'
								valor={config.primera_fila}
								opciones={opcionesPrimeraFila}
								ancho='w-32'
								onCambio={valor => handleCambioConfig('primera_fila', valor)}
							/>

							<CampoSelect
								etiqueta='Última fila'
								valor={config.ultima_fila}
								opciones={opcionesUltimaFila}
								ancho='w-32'
								onCambio={valor => handleCambioConfig('ultima_fila', valor)}
							/>
						</div>

						<p className='text-xs text-muted-foreground'>
							La grilla es solo de lectura. Haz clic en un número de fila para
							ajustar el rango: si la fila está antes de la primera, fija el
							inicio; si no, fija el final.
						</p>

						<GrillaVistaPreviaExcel
							analisis={analisis}
							filaEncabezados={config.fila_encabezados}
							primeraFila={config.primera_fila}
							ultimaFila={config.ultima_fila}
							onSeleccionarFila={handleSeleccionarFila}
						/>

						{validarMutation.isError && (
							<p className='text-xs font-medium text-destructive' role='alert'>
								{mensajeError(validarMutation.error)}
							</p>
						)}
					</div>
				)}

				{paso === 2 && validacion && (
					<div className='min-w-0 space-y-3'>
						<div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
							<span>
								<span className='font-medium text-foreground'>
									{validacion.cantidad_registros}
								</span>{' '}
								registros
							</span>
							{validacion.suma_prorrateos != null && (
								<span>
									Suma de prorrateos:{' '}
									<span className='font-medium text-foreground'>
										{formatearProrrateoPorcentaje(validacion.suma_prorrateos)}
									</span>
								</span>
							)}
							{validacion.filas_excluidas.length > 0 && (
								<span className='text-destructive'>
									Filas excluidas: {validacion.filas_excluidas.join(', ')}
								</span>
							)}
						</div>

						{validacion.confirmacion_requerida && (
							<div className='space-y-2 rounded-md border border-warning/40 bg-warning/10 p-3'>
								<p className='text-xs font-medium text-warning'>
									Interpretación de porcentajes por confirmar
								</p>
								<p className='text-xs text-muted-foreground'>
									{validacion.interpretacion.motivo}
								</p>
								<RadioGroup
									value={config.interpretacion_prorrateo ?? ''}
									onValueChange={handleInterpretacion}
									className='gap-1.5'
								>
									{INTERPRETACIONES.map(opcion => (
										<div key={opcion.value} className='flex items-center gap-2'>
											<RadioGroupItem
												value={opcion.value}
												id={`interpretacion-${opcion.value}`}
											/>
											<Label
												htmlFor={`interpretacion-${opcion.value}`}
												className='text-xs font-normal'
											>
												{opcion.label}
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>
						)}

						<TablaRegistrosAlicuotas
							registros={validacion.registros}
							problemas={validacion.problemas}
							filasExcluidas={validacion.filas_excluidas}
						/>
					</div>
				)}

				{paso === 3 && validacion && (
					<div className='min-w-0 space-y-3'>
						<div className='space-y-2 rounded-md border border-border/70 bg-muted/10 p-3 text-sm'>
							<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
								Resumen de la importación
							</p>
							<dl className='grid grid-cols-2 gap-x-6 gap-y-1.5'>
								<div className='flex justify-between gap-2'>
									<dt className='text-xs text-muted-foreground'>Archivo</dt>
									<dd className='text-xs font-medium text-foreground'>
										{archivo?.name}
									</dd>
								</div>
								<div className='flex justify-between gap-2'>
									<dt className='text-xs text-muted-foreground'>Hoja</dt>
									<dd className='text-xs font-medium text-foreground'>
										{config.hoja}
									</dd>
								</div>
								<div className='flex justify-between gap-2'>
									<dt className='text-xs text-muted-foreground'>
										Fila de encabezados
									</dt>
									<dd className='text-xs font-medium text-foreground'>
										{config.fila_encabezados}
									</dd>
								</div>
								<div className='flex justify-between gap-2'>
									<dt className='text-xs text-muted-foreground'>Columnas</dt>
									<dd className='text-xs font-medium text-foreground'>
										{letraColumna(config.columna_identificador)} (identificador)
										· {letraColumna(config.columna_prorrateo)} (prorrateo)
									</dd>
								</div>
								<div className='flex justify-between gap-2'>
									<dt className='text-xs text-muted-foreground'>
										Rango de filas
									</dt>
									<dd className='text-xs font-medium text-foreground'>
										{config.primera_fila} – {config.ultima_fila}
									</dd>
								</div>
								<div className='flex justify-between gap-2'>
									<dt className='text-xs text-muted-foreground'>
										Unidades detectadas
									</dt>
									<dd className='text-xs font-medium text-foreground'>
										{validacion.cantidad_registros}
									</dd>
								</div>
								<div className='flex justify-between gap-2'>
									<dt className='text-xs text-muted-foreground'>
										Advertencias
									</dt>
									<dd className='text-xs font-medium text-foreground'>
										{
											validacion.problemas.filter(
												problema => problema.severidad === 'advertencia',
											).length
										}
									</dd>
								</div>
								<div className='flex justify-between gap-2'>
									<dt className='text-xs text-muted-foreground'>
										Suma de prorrateos
									</dt>
									<dd className='text-xs font-medium text-foreground'>
										{validacion.suma_prorrateos != null
											? formatearProrrateoPorcentaje(validacion.suma_prorrateos)
											: '—'}
									</dd>
								</div>
							</dl>
						</div>

						<p className='text-xs text-muted-foreground'>
							Al confirmar, las unidades se asocian a la solicitud de
							cotización. Los cálculos posteriores usan estas alícuotas tal como
							se muestran.
						</p>
					</div>
				)}

				<DialogFooter className='gap-2'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() => handleOpenChange(false)}
					>
						Cancelar
					</Button>

					{paso > 0 && (
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => setPaso(actual => Math.max(0, actual - 1))}
						>
							Volver
						</Button>
					)}

					{paso === 0 && (
						<Button
							type='button'
							size='sm'
							disabled={!archivo || analizarMutation.isPending}
							onClick={() => analizar()}
						>
							{analizarMutation.isPending ? (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden />
							) : (
								<Upload className='mr-2 h-4 w-4' aria-hidden />
							)}
							Analizar archivo
						</Button>
					)}

					{paso === 1 && (
						<Button
							type='button'
							size='sm'
							disabled={!puedeValidar || validarMutation.isPending}
							onClick={() => validar(config)}
						>
							{validarMutation.isPending ? (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden />
							) : null}
							Validar registros
						</Button>
					)}

					{paso === 2 && (
						<Button
							type='button'
							size='sm'
							disabled={!puedeContinuar}
							onClick={() => setPaso(3)}
						>
							Continuar
						</Button>
					)}

					{paso === 3 && (
						<Button type='button' size='sm' onClick={confirmar}>
							Importar unidades
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
