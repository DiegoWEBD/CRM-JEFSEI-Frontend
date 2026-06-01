import { PrioridadSolicitud } from '../solicitud-estudio/prioridad-solicitud'

export type ArchivoEstudioEmitido = {
	nombre: string
	tamanoBytes: number
	tipoMime: string
	/** Data URL u object URL para vista previa en sesión. */
	url: string
}

export type EstudioEmitidoRegistro = {
	id: string
	solicitudId: string
	clienteId?: string
	cliente: string
	lineaSeguro: string
	ejecutivoComercial: string
	archivoEstudio: ArchivoEstudioEmitido
	fechaEmision: string
	horaEmision: string
	fechaEmisionIso: string
	usuarioEmisor: string
	observaciones?: string
	estado: 'estudio_emitido'
	prioridadHeredada: PrioridadSolicitud
}
