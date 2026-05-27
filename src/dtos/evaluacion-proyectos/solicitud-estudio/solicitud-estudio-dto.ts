import { EstadoSolicitudEstudio } from '@/app/types/evaluacion-proyectos/solicitud-estudio/estado-solicitud-estudio'
import { InformacionFaltanteTagId } from '@/app/types/evaluacion-proyectos/solicitud-estudio/informacion-faltante-tag-id'
import { PrioridadSolicitud } from '@/app/types/evaluacion-proyectos/solicitud-estudio/prioridad-solicitud'

export interface SolicitudEstudioDto {
	id: string
	/** Referencia al cliente del CRM; los datos generales viven en el perfil. */
	clienteId?: string
	/** Referencia a la línea de seguro asociada dentro del perfil comercial. */
	lineaSeguroId?: string
	/** Solicitud o estudio previo (recotización con trazabilidad). */
	solicitudOrigenId?: string
	/** Indica recotización solicitada por ejecutivo comercial. */
	esRecotizacion?: boolean
	cliente: string
	lineaSeguro: string
	ejecutivoComercial: string
	estado: EstadoSolicitudEstudio
	informacionFaltante: InformacionFaltanteTagId[]
	/** Fecha calendario de ingreso (YYYY-MM-DD). */
	fechaSolicitud: string
	/** Momento exacto de ingreso de la solicitud (ISO 8601). */
	fechaSolicitudIso?: string
	ultimaActualizacion: string
	prioridad: PrioridadSolicitud
	detalleHref: string
	/** Fecha comprometida informada al área de evaluación (perfil comercial). */
	fechaRequeridaComercial?: string
	/** Responsable sugerido en evaluación/proyecto (mock). */
	evaluadoraAsignada?: string
	/** Texto breve para el modal de detalle (mock). */
	resumenDetalle: {
		documentos: string[]
		metros: string[]
		observaciones: string[]
		historial: string[]
		archivos: string[]
		notas: string[]
		datosTecnicos: string[]
	}
}
