import { Badge } from '@/components/badge/badge'
import Button from '@/components/button/button'
import Dialog from '@/components/dialog/dialog'
import DialogContent from '@/components/dialog/dialog-content/dialog-content'
import DialogDescription from '@/components/dialog/dialog-description/dialog-description'
import DialogFooter from '@/components/dialog/dialog-footer/dialog-footer'
import DialogHeader from '@/components/dialog/dialog-header/dialog-hedaer'
import DialogTitle from '@/components/dialog/dialog-title/dialog-title'
import Label from '@/components/forms/label/label'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import Textarea from '@/components/forms/text-area/text-area'
import SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import {
	ESTADO_COTIZACION_PERFIL_BADGE,
	ESTADO_COTIZACION_PERFIL_LABELS,
	ESTADO_ESTUDIO_PERFIL_BADGE,
	ESTADO_ESTUDIO_PERFIL_LABELS,
} from '@/lib/estados-cotizaciones'
import {
	MOTIVO_CIERRE_PERDIDO_LABELS,
	MOTIVO_RECOTIZACION_LABELS,
	MotivoCierrePerdidoLinea,
	MotivoRecotizacionLinea,
	MOTIVOS_CIERRE_PERDIDO_LINEA,
	MOTIVOS_RECOTIZACION_LINEA,
} from '@/lib/motivos-recotizacion'
import { formatFechaCorta } from '@/utils/format-fecha-corta'
import { formatearFecha } from '@/utils/formatear-fecha'
import { addMonths, format } from 'date-fns'
import { useState } from 'react'

type DialogDetalleSolicitudProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	solicitud: SolicitudCotizacion
	onSolicitarRecotizacion?: (
		lineaId: string,
		motivo: MotivoRecotizacionLinea,
		observaciones?: string,
	) => void | Promise<void>
	onAbrirSubirPoliza?: (lineaId: string) => void
	onCerrarPerdido?: (
		lineaId: string,
		motivo: MotivoCierrePerdidoLinea,
		observaciones?: string,
	) => void
}

export default function DialogDetalleSolicitud({
	open,
	onOpenChange,
	solicitud,
	onSolicitarRecotizacion,
	onAbrirSubirPoliza,
	onCerrarPerdido,
}: DialogDetalleSolicitudProps) {
	const [subModal, setSubModal] = useState<'recotizacion' | 'perdido' | null>(
		null,
	)
	const [motivoRecotizacion, setMotivoRecotizacion] = useState<
		MotivoRecotizacionLinea | ''
	>('')
	const [obsRecotizacion, setObsRecotizacion] = useState('')
	const [motivoCerrarPerdido, setMotivoCerrarPerdido] = useState<
		MotivoCierrePerdidoLinea | ''
	>('')
	const [obsCerrarPerdido, setObsCerrarPerdido] = useState('')
	const [procesando, setProcesando] = useState(false)

	/*useEffect(() => {
		if (!open) {
			setSubModal(null)
			setMotivoRecotizacion('')
			setObsRecotizacion('')
			setMotivoCerrarPerdido('')
			setObsCerrarPerdido('')
			setProcesando(false)
		}
	}, [open])*/

	/*const estadoPerfil = solicitud
		? estadoSolicitudCotizacionPerfil(solicitud, { solicitudTieneEstudioEmitido })
		: null
	const estadoCotizacion = estadoPerfil
		? estadoCotizacionPerfilDesdeSolicitud(estadoPerfil)
		: null
	const estadoEstudio = solicitud
		? estadoEstudioPerfilDesdeLinea(solicitud, { solicitudTieneEstudioEmitido })
		: null*/

	const cerrarPrincipal = () => onOpenChange(false)

	const confirmarRecotizacion = async () => {
		console.log('CONFIRMAR RECOTIZACIÓN')
		/*if (!solicitud || !motivoRecotizacion || !onSolicitarRecotizacion) return
		setProcesando(true)
		try {
			await onSolicitarRecotizacion(
				solicitud.id,
				motivoRecotizacion,
				obsRecotizacion.trim(),
			)
			setSubModal(null)
			cerrarPrincipal()
		} finally {
			setProcesando(false)
		}*/
	}

	const confirmarPerdido = () => {
		console.log('CONFIRMAR PERDIDO')
		/*if (!solicitud || !motivoCerrarPerdido || !onCerrarPerdido) return
		onCerrarPerdido(solicitud.id, motivoCerrarPerdido, obsCerrarPerdido.trim())
		setSubModal(null)
		cerrarPrincipal()*/
	}

	/*const mostrarMarcarEnviado =
		estadoPerfil === 'estudio_disponible' &&
		Boolean(onMarcarEstudioEnviadoCliente)*/

	const mostrarMarcarEnviado = true
	const mostrarAccionesEnviado = true

	/*const mostrarAccionesEnviado =
		estadoPerfil === 'estudio_enviado_cliente' &&
		Boolean(onSolicitarRecotizacion || onAbrirSubirPoliza || onCerrarPerdido)*/

	const fechaRecot = formatFechaCorta(solicitud.fecha)
	const motivoRecotLabel = 'Motivo recotización'
	const fechaCierre = formatFechaCorta(solicitud.fecha)
	const motivoPerdidoLabel = 'Motivo perdido'

	return (
		<>
			<Dialog open={open && subModal == null} onOpenChange={onOpenChange}>
				<DialogContent className='max-w-sm gap-4'>
					<DialogHeader>
						<DialogTitle>Ver solicitud</DialogTitle>
					</DialogHeader>

					{solicitud ? (
						<dl className='space-y-2.5'>
							<div>
								<dt className='text-xs text-muted-foreground'>Producto</dt>
								<dd className='text-sm font-medium text-foreground'>
									Unidades
								</dd>
							</div>
							<div>
								<dt className='text-xs text-muted-foreground'>
									Estado de cotización
								</dt>
								<dd className='mt-1'>
									<Badge
										className={
											ESTADO_COTIZACION_PERFIL_BADGE['nueva_solicitud']
										}
									>
										{ESTADO_COTIZACION_PERFIL_LABELS['nueva_solicitud']}
									</Badge>
								</dd>
							</div>

							<div>
								<dt className='text-xs text-muted-foreground'>
									Estado de estudio
								</dt>
								<dd className='mt-1'>
									<Badge
										className={
											ESTADO_ESTUDIO_PERFIL_BADGE['estudio_disponible']
										}
									>
										{ESTADO_ESTUDIO_PERFIL_LABELS['estudio_disponible']}
									</Badge>
								</dd>
							</div>

							{/*solicitud.estudios.length > 0 ? (
								<div>
									<dt className='mb-1 text-xs text-muted-foreground'>
										Estudios asociados
									</dt>
									<dd className='space-y-1.5'>
										{solicitud.estudios.map(estudio => (
											<div
												key={estudio.id}
												className='flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/80 bg-muted/20 px-2 py-1.5'
											>
												<span className='text-sm font-medium text-foreground'>
													{estudio.nombre}
												</span>
												{estadoEstudio ? (
													<EstadoPerfilClienteBadge
														label={ESTADO_ESTUDIO_PERFIL_LABELS[estadoEstudio]}
														badgeClassName={
															ESTADO_ESTUDIO_PERFIL_BADGE[estadoEstudio]
														}
													/>
												) : null}
											</div>
										))}
									</dd>
								</div>
							) : null*/}

							<div>
								<dt className='text-xs text-muted-foreground'>
									Fecha de solicitud
								</dt>
								<dd className='text-sm font-medium text-foreground'>
									{formatearFecha(new Date(solicitud.fecha), 'dd-MM-yyyy')}
								</dd>
							</div>

							{solicitud.observaciones ? (
								<div>
									<dt className='text-xs text-muted-foreground'>Observación</dt>
									<dd className='whitespace-pre-wrap text-sm text-foreground'>
										{solicitud.observaciones}
									</dd>
								</div>
							) : null}

							{/**{estadoPerfil === 'recotizacion_solicitada' && fechaRecot ? (
								<CampoInfo label='Fecha de recotización' value={fechaRecot} />
							) : null}

							{estadoPerfil === 'recotizacion_solicitada' &&
							motivoRecotLabel ? (
								<CampoInfo
									label='Motivo de recotización'
									value={motivoRecotLabel}
								/>
							) : null}
                            
							{(estadoPerfil === 'cerrado_ganado' ||
								estadoPerfil === 'cerrado_perdido') &&
							fechaCierre ? (
								<CampoInfo
									label={
										estadoPerfil === 'cerrado_perdido'
											? 'Fecha de cierre perdido'
											: 'Fecha de cierre'
									}
									value={fechaCierre}
								/>
							) : null}
							{estadoPerfil === 'cerrado_perdido' && motivoPerdidoLabel ? (
								<CampoInfo
									label='Motivo de cierre perdido'
									value={motivoPerdidoLabel}
								/>
							) : null} */}
						</dl>
					) : null}

					<DialogFooter className='flex-col gap-2 sm:flex-col sm:items-stretch'>
						{mostrarMarcarEnviado ? (
							<Button
								type='button'
								size='sm'
								className='h-8 w-full text-xs shadow-none'
								onClick={() => console.log('Marcar enviado')}
							>
								Marcar estudio enviado al cliente
							</Button>
						) : null}

						{mostrarAccionesEnviado ? (
							<div className='flex flex-col gap-2'>
								{onSolicitarRecotizacion ? (
									<Button
										type='button'
										variant='outline'
										size='sm'
										className='h-8 w-full text-xs shadow-none'
										onClick={() => setSubModal('recotizacion')}
									>
										Solicitar recotización
									</Button>
								) : null}
								{onAbrirSubirPoliza ? (
									<Button
										type='button'
										variant='outline'
										size='sm'
										className='h-8 w-full text-xs shadow-none'
										onClick={() => {
											console.log('abrir subir poliza')
											//onAbrirSubirPoliza(solicitud!.id)
											cerrarPrincipal()
										}}
									>
										Subir póliza
									</Button>
								) : null}
								{onCerrarPerdido ? (
									<Button
										type='button'
										variant='outline'
										size='sm'
										className='h-8 w-full text-xs text-destructive shadow-none hover:text-destructive'
										onClick={() => setSubModal('perdido')}
									>
										Cerrar como perdido
									</Button>
								) : null}
							</div>
						) : null}

						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-8 w-full text-xs'
							onClick={cerrarPrincipal}
						>
							Cerrar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={open && subModal === 'recotizacion'}
				onOpenChange={o => !o && setSubModal(null)}
			>
				<DialogContent className='max-w-sm gap-4'>
					<DialogHeader>
						<DialogTitle>Solicitar recotización</DialogTitle>
						<DialogDescription>
							Indique el motivo. Se registrará una nueva solicitud en
							evaluación.
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-1.5'>
						<Label className='text-xs'>Motivo de recotización</Label>
						<Select
							value={motivoRecotizacion || '__none__'}
							onValueChange={v =>
								setMotivoRecotizacion(
									v === '__none__' ? '' : (v as MotivoRecotizacionLinea),
								)
							}
						>
							<SelectTrigger className='h-9 text-sm'>
								<SelectValue placeholder='Seleccione motivo' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									value='__none__'
									className='text-xs text-muted-foreground'
								>
									Seleccione motivo
								</SelectItem>
								{MOTIVOS_RECOTIZACION_LINEA.map(k => (
									<SelectItem key={k} value={k} className='text-xs'>
										{MOTIVO_RECOTIZACION_LABELS[k]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='space-y-1.5'>
						<Label className='text-xs'>Observación (opcional)</Label>
						<Textarea
							className='min-h-[72px] text-sm'
							value={obsRecotizacion}
							onChange={e => setObsRecotizacion(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => setSubModal(null)}
							disabled={procesando}
						>
							Cancelar
						</Button>
						<Button
							type='button'
							size='sm'
							disabled={!motivoRecotizacion || procesando}
							onClick={() => void confirmarRecotizacion()}
						>
							Confirmar recotización
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={open && subModal === 'perdido'}
				onOpenChange={o => !o && setSubModal(null)}
			>
				<DialogContent className='max-w-sm gap-4'>
					<DialogHeader>
						<DialogTitle>Cerrar como perdido</DialogTitle>
						<DialogDescription>
							Se programará un recordatorio para recontactar en 6 meses (
							{format(addMonths(new Date(), 6), 'dd-MM-yyyy')}).
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-1.5'>
						<Label className='text-xs'>Motivo de cierre perdido</Label>
						<Select
							value={motivoCerrarPerdido || '__none__'}
							onValueChange={v =>
								setMotivoCerrarPerdido(
									v === '__none__' ? '' : (v as MotivoCierrePerdidoLinea),
								)
							}
						>
							<SelectTrigger className='h-9 text-sm'>
								<SelectValue placeholder='Seleccione motivo' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									value='__none__'
									className='text-xs text-muted-foreground'
								>
									Seleccione motivo
								</SelectItem>
								{MOTIVOS_CIERRE_PERDIDO_LINEA.map(k => (
									<SelectItem key={k} value={k} className='text-xs'>
										{MOTIVO_CIERRE_PERDIDO_LABELS[k]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='space-y-1.5'>
						<Label className='text-xs'>Observación (opcional)</Label>
						<Textarea
							className='min-h-[72px] text-sm'
							value={obsCerrarPerdido}
							onChange={e => setObsCerrarPerdido(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => setSubModal(null)}
						>
							Cancelar
						</Button>
						<Button
							type='button'
							size='sm'
							variant='destructive'
							disabled={!motivoCerrarPerdido}
							onClick={confirmarPerdido}
						>
							Confirmar cierre
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
