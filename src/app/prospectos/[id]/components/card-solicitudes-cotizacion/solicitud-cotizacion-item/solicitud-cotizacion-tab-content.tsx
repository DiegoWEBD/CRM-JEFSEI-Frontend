'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Skeleton } from '@/components/skeleton'
import type SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { useCotizaciones } from '@/hooks/cotizaciones/use-cotizaciones'
import { useListarEstudiosComerciales } from '@/hooks/estudio-comercial/use-listar-estudios-comerciales'
import {
	ESTADO_COTIZACION_PERFIL_BADGE,
	ESTADO_COTIZACION_PERFIL_LABELS,
	ESTADO_ESTUDIO_PERFIL_BADGE,
	ESTADO_ESTUDIO_PERFIL_LABELS,
} from '@/lib/estados-cotizaciones'
import { TIPO_LINEA_LABELS } from '@/lib/solicitud-cotizacion-catalogo'
import { formatUF } from '@/lib/uf'
import { cn } from '@/lib/utils'
import { formatearFecha } from '@/utils/formatear-fecha'
import { Download, FileText } from 'lucide-react'
import { useState } from 'react'
import DialogGenerarEstudioWrapper from './dialog-generar-estudio-wrapper'
import DialogRegistrarCotizacion from './dialog-registrar-cotizacion/dialog-registrar-cotizacion'
import DialogSubirEstudio from './dialog-subir-estudio/dialog-subir-estudio'
import DialogVerCotizacionesWrapper from './dialog-ver-cotizaciones-wrapper'

type TabId = 'solicitud' | 'cotizaciones' | 'estudio' | 'observaciones'

type SolicitudCotizacionTabContentProps = {
	solicitud: SolicitudCotizacion
	idProspecto: number
	tab: TabId
	nombreCliente: string
	lineaNegocioNombre: string
	ejecutivoEvaluacionRut?: string
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

const ESTADO_VENC_COLORS: Record<string, string> = {
	vigente: 'bg-success/12 text-success dark:bg-success/20',
	por_vencer: 'bg-warning/15 text-warning dark:bg-warning/20',
	vencida: 'bg-destructive/12 text-destructive dark:bg-destructive/20',
}

const ESTADO_VENC_LABELS: Record<string, string> = {
	vigente: 'Vigente',
	por_vencer: 'Por vencer',
	vencida: 'Vencida',
}

function calcularEstadoVenc(fechaStr: string): string {
	const hoy = new Date()
	const venc = new Date(fechaStr)
	const diffDias = (venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
	if (diffDias < 0) return 'vencida'
	if (diffDias <= 30) return 'por_vencer'
	return 'vigente'
}

export default function SolicitudCotizacionTabContent({
	solicitud,
	idProspecto,
	tab,
	nombreCliente,
	lineaNegocioNombre,
	ejecutivoEvaluacionRut,
}: SolicitudCotizacionTabContentProps) {
	const { usuario } = useUserSession()
	const { data: cotizaciones, isLoading: loadingCotizaciones } =
		useCotizaciones(solicitud.id)
	const { data: estudios, isLoading: loadingEstudios } =
		useListarEstudiosComerciales(solicitud.id)

	const [openRegistrarCotizacion, setOpenRegistrarCotizacion] = useState(false)
	const [openVerCotizaciones, setOpenVerCotizaciones] = useState(false)
	const [openGenerarEstudio, setOpenGenerarEstudio] = useState(false)
	const [openSubirEstudio, setOpenSubirEstudio] = useState(false)

	const nombreEjecutivo =
		solicitud.nombre_ejecutivo_comercial || solicitud.ejecutivo_comercial

	const tieneCotizaciones = solicitud.cantidad_cotizaciones > 0

	const hasDetalles =
		(solicitud.tipo === 'vida_guardia' && solicitud.numero_guardias != null) ||
		(solicitud.tipo === 'unidades' && solicitud.nombre_excel != null) ||
		solicitud.monto_asegurado != null ||
		(solicitud.tipo === 'accidentes_personales' &&
			solicitud.actividades &&
			solicitud.actividades.length > 0) ||
		(solicitud.tipo === 'rc_condominio' &&
			(solicitud.actividad_del_condominio || solicitud.limite != null))

	if (tab === 'solicitud') {
		return (
			<dl className='space-y-2.5 pt-3 text-sm'>
				<div>
					<dt className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
						Información general
					</dt>
				</div>

				<div>
					<dt className='text-xs text-muted-foreground'>Producto</dt>
					<dd className='font-medium text-foreground'>
						{solicitud.producto ||
							TIPO_LINEA_LABELS[
								solicitud.tipo as keyof typeof TIPO_LINEA_LABELS
							] ||
							solicitud.tipo}
					</dd>
				</div>

				{solicitud.rut_ejecutivo_comercial || nombreEjecutivo ? (
					<div>
						<dt className='text-xs text-muted-foreground'>Gestión comercial</dt>
						<dd className='font-medium text-foreground'>{nombreEjecutivo}</dd>
					</div>
				) : null}

				<div>
					<dt className='text-xs text-muted-foreground'>Fecha de solicitud</dt>
					<dd className='font-medium text-foreground'>
						{formatearFecha(new Date(solicitud.fecha), 'dd-MM-yyyy HH:mm')}
					</dd>
				</div>

				{hasDetalles ? (
					<>
						<div className='pt-1'>
							<dt className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
								Detalles del seguro
							</dt>
						</div>

						{solicitud.tipo === 'vida_guardia' &&
						solicitud.numero_guardias != null ? (
							<div>
								<dt className='text-xs text-muted-foreground'>
									Número de guardias
								</dt>
								<dd className='font-medium text-foreground'>
									{solicitud.numero_guardias}
								</dd>
							</div>
						) : null}

						{solicitud.monto_asegurado != null ? (
							<div>
								<dt className='text-xs text-muted-foreground'>
									Monto asegurado
								</dt>
								<dd className='font-medium text-foreground'>
									{solicitud.monto_asegurado.toLocaleString('es-CL')}
								</dd>
							</div>
						) : null}

						{solicitud.tipo === 'unidades' && solicitud.nombre_excel ? (
							<div>
								<dt className='text-xs text-muted-foreground'>Archivo Excel</dt>
								<dd className='font-medium text-foreground'>
									{solicitud.nombre_excel}
								</dd>
							</div>
						) : null}

						{solicitud.tipo === 'accidentes_personales' &&
						solicitud.actividades &&
						solicitud.actividades.length > 0 ? (
							<div>
								<dt className='mb-1 text-xs text-muted-foreground'>
									Actividades aseguradas
								</dt>
								<dd className='space-y-1'>
									{solicitud.actividades.map((act, i) => (
										<div
											key={i}
											className='flex items-center justify-between gap-2 rounded-md border border-border/80 bg-muted/20 px-2 py-1.5'
										>
											<span className='text-sm text-foreground'>
												{act.actividad}
											</span>
											<Badge variant='outline' className='shrink-0 text-xs'>
												{act.numero_asegurados} asegurado
												{act.numero_asegurados !== 1 ? 's' : ''}
											</Badge>
										</div>
									))}
								</dd>
							</div>
						) : null}

						{solicitud.tipo === 'rc_condominio' ? (
							<>
								{solicitud.actividad_del_condominio ? (
									<div>
										<dt className='text-xs text-muted-foreground'>
											Actividad del condominio
										</dt>
										<dd className='font-medium text-foreground'>
											{solicitud.actividad_del_condominio}
										</dd>
									</div>
								) : null}
								{solicitud.limite != null ? (
									<div>
										<dt className='text-xs text-muted-foreground'>Límite RC</dt>
										<dd className='font-medium text-foreground'>
											{solicitud.limite.toLocaleString('es-CL')}
										</dd>
									</div>
								) : null}
							</>
						) : null}
					</>
				) : null}

				{tieneCotizaciones || (estudios && estudios.length > 0) ? (
					<>
						<div className='pt-1'>
							<dt className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
								Estado
							</dt>
						</div>

						{tieneCotizaciones ? (
							<div>
								<dt className='text-xs text-muted-foreground'>Cotización</dt>
								<dd className='mt-1'>
									<Badge
										variant={
											ESTADO_COTIZACION_PERFIL_BADGE['cotizacion_generada']
										}
									>
										{ESTADO_COTIZACION_PERFIL_LABELS['cotizacion_generada']}
									</Badge>
								</dd>
							</div>
						) : null}

						{estudios && estudios.length > 0 ? (
							<div>
								<dt className='text-xs text-muted-foreground'>Estudio</dt>
								<dd className='mt-1'>
									<Badge
										variant={ESTADO_ESTUDIO_PERFIL_BADGE['estudio_disponible']}
									>
										{ESTADO_ESTUDIO_PERFIL_LABELS['estudio_disponible']}
									</Badge>
								</dd>
							</div>
						) : null}
					</>
				) : null}

				{solicitud.observaciones ? (
					<div>
						<dt className='text-xs text-muted-foreground'>Observación</dt>
						<dd className='whitespace-pre-wrap text-foreground'>
							{solicitud.observaciones}
						</dd>
					</div>
				) : null}
			</dl>
		)
	}

	if (tab === 'cotizaciones') {
		return (
			<div className='space-y-3 pt-3'>
				<div className='flex flex-wrap items-center justify-between gap-2'>
					<p className='text-xs text-muted-foreground'>
						{solicitud.cantidad_cotizaciones}{' '}
						{cotizaciones && cotizaciones.length !== 1
							? 'cotizaciones recibidas.'
							: 'cotización recibida.'}
					</p>
					<div className='flex flex-wrap gap-1.5'>
						{solicitud.cantidad_cotizaciones > 0 ? (
							<Button
								type='button'
								variant='outline'
								size='sm'
								className='h-7 text-xs shadow-none'
								onClick={() => setOpenVerCotizaciones(true)}
							>
								Ver cotizaciones detallado
							</Button>
						) : null}
						{usuario?.rut === ejecutivoEvaluacionRut ? (
							<Button
								type='button'
								size='sm'
								className='h-7 text-xs shadow-none'
								onClick={() => setOpenRegistrarCotizacion(true)}
							>
								Agregar cotización
							</Button>
						) : null}
					</div>
				</div>

				{loadingCotizaciones ? (
					<div className='space-y-2'>
						{Array.from({ length: 2 }).map((_, i) => (
							<Skeleton key={i} className='h-12 w-full' />
						))}
					</div>
				) : cotizaciones && cotizaciones.length > 0 ? (
					<div className='space-y-2'>
						{cotizaciones.map(cotizacion => {
							const ev = calcularEstadoVenc(cotizacion.fecha_vencimiento)
							return (
								<div
									key={cotizacion.id}
									className='rounded-md border border-border/70 bg-card p-2.5 text-xs'
								>
									<div className='flex items-start justify-between gap-2'>
										<span className='font-medium text-foreground'>
											{cotizacion.company}
										</span>
										<span
											className={cn(
												'inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none',
												ESTADO_VENC_COLORS[ev],
											)}
										>
											{ESTADO_VENC_LABELS[ev]}
										</span>
									</div>
									<div className='mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-muted-foreground sm:grid-cols-4'>
										<span>
											Monto: {formatUF(cotizacion.monto_total_asegurado)}
										</span>
										<span>
											Prima afecta:{' '}
											{cotizacion.prima_afecta
												? formatUF(cotizacion.prima_afecta)
												: '—'}
										</span>
										<span>
											Prima excenta:{' '}
											{cotizacion.prima_excenta
												? formatUF(cotizacion.prima_excenta)
												: '—'}
										</span>
										<span>
											Prima neta:{' '}
											{cotizacion.prima_neta
												? formatUF(cotizacion.prima_neta)
												: '—'}
										</span>
										<span>
											Prima IVA:{' '}
											{cotizacion.prima_iva
												? formatUF(cotizacion.prima_iva)
												: '—'}
										</span>
										<span>
											Prima bruta:{' '}
											{cotizacion.prima_bruta
												? formatUF(cotizacion.prima_bruta)
												: '—'}
										</span>
										<span>
											Emisión:{' '}
											{formatearFecha(
												new Date(cotizacion.fecha_emision),
												'dd-MM-yyyy',
											)}
										</span>
										<span>
											Vence:{' '}
											{formatearFecha(
												new Date(cotizacion.fecha_vencimiento),
												'dd-MM-yyyy',
											)}
										</span>
									</div>
									{cotizacion.nombre_archivo && cotizacion.archivo_base64 && (
										<Button
											type='button'
											variant='outline'
											size='sm'
											className='mt-2 h-7 text-xs'
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
									)}
								</div>
							)
						})}
					</div>
				) : (
					<p className='rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground'>
						Aún no hay cotizaciones registradas.
					</p>
				)}

				<DialogRegistrarCotizacion
					solicitudId={solicitud.id}
					idProspecto={idProspecto}
					open={openRegistrarCotizacion}
					onOpenChange={setOpenRegistrarCotizacion}
				/>

				<DialogVerCotizacionesWrapper
					solicitud={solicitud}
					nombreCliente={nombreCliente}
					lineaNegocioNombre={lineaNegocioNombre}
					nombreEjecutivo={nombreEjecutivo}
					open={openVerCotizaciones}
					onOpenChange={setOpenVerCotizaciones}
				/>
			</div>
		)
	}

	if (tab === 'estudio') {
		return (
			<div className='space-y-3 pt-3'>
				{usuario?.rut === ejecutivoEvaluacionRut ? (
					<div className='flex flex-wrap gap-2'>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-8 text-xs'
							onClick={() => setOpenSubirEstudio(true)}
						>
							Subir estudio
						</Button>
						<Button
							type='button'
							size='sm'
							className='h-8 text-xs'
							disabled={!cotizaciones || cotizaciones.length === 0}
							onClick={() => setOpenGenerarEstudio(true)}
						>
							Generar estudio
						</Button>
					</div>
				) : null}

				{loadingEstudios ? (
					<div className='space-y-2'>
						<Skeleton className='h-12 w-full' />
						<Skeleton className='h-12 w-full' />
					</div>
				) : estudios && estudios.length > 0 ? (
					<div className='space-y-2'>
						{estudios.map(e => (
							<div
								key={e.id}
								className='flex items-center justify-between gap-2 rounded-md border border-border/70 bg-card p-2.5'
							>
								<div className='flex min-w-0 items-center gap-2'>
									<FileText className='size-4 shrink-0 text-destructive' />
									<span className='truncate text-xs text-foreground'>
										{e.nombre_archivo}
									</span>
								</div>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-7 shrink-0 text-xs'
									onClick={() => {
										window.open(
											`/api/solicitudes-cotizacion/${solicitud.id}/estudios-comerciales/${e.id}/archivo`,
											'_blank',
										)
									}}
								>
									<Download className='mr-1 size-3' />
									Descargar PDF
								</Button>
							</div>
						))}
					</div>
				) : !cotizaciones || cotizaciones.length === 0 ? (
					<p className='rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground'>
						Debe registrar al menos una cotización para generar el estudio.
					</p>
				) : (
					<p className='rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground'>
						Sin estudios disponibles.
					</p>
				)}

				<DialogGenerarEstudioWrapper
					solicitud={solicitud}
					idProspecto={idProspecto}
					nombreCliente={nombreCliente}
					lineaNegocioNombre={lineaNegocioNombre}
					nombreEjecutivo={nombreEjecutivo}
					open={openGenerarEstudio}
					onOpenChange={setOpenGenerarEstudio}
				/>

				<DialogSubirEstudio
					solicitudId={solicitud.id}
					idProspecto={idProspecto}
					open={openSubirEstudio}
					onOpenChange={setOpenSubirEstudio}
				/>
			</div>
		)
	}

	if (tab === 'observaciones') {
		return (
			<div className='pt-3'>
				{solicitud.observaciones?.trim() ? (
					<p className='whitespace-pre-wrap rounded-md border border-border/70 bg-muted/20 p-3 text-sm text-foreground'>
						{solicitud.observaciones.trim()}
					</p>
				) : (
					<p className='rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground'>
						Sin observaciones.
					</p>
				)}
			</div>
		)
	}

	return null
}
