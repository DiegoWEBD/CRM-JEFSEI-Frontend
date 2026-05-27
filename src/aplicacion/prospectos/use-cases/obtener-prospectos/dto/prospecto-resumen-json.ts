import { EstadoComercialProspecto } from '@/app/types/estados/estado-comercial-cliente'

export interface ProspectoResumenJson {
	id: number
	nombre_riesgo: string
	nombre_contacto: string
	linea_negocio: string
	estado: EstadoComercialProspecto
	dias_limite: number
	dias_transcurridos: number
	ultima_gestion: string
	fecha_ultima_accion: string
	proxima_accion: string | null
	fecha_proxima_accion: string
	prioridad: 'baja' | 'media' | 'alta'
	fecha_registro: string
	asignacion_pendiente_revision: boolean
	rut?: string
	telefono?: string
	correo?: string
	contacto?: string
	ejecutivo_comercial?: string
	estado_informacion?: 'informacion_incompleta' | 'informacion_completa'
	fecha_ultima_actualizacion?: string
}
