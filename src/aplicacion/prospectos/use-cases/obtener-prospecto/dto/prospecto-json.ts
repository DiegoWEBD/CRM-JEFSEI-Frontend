import { HistorialEstadoJson } from '@/aplicacion/estados/dto/historial-estado-json'
import { EvaluacionRiesgoJson } from '@/aplicacion/evaluacion-riesgo/dto/evaluacion-riesgo-json'
import { PlanificacionProspectoJson } from '@/aplicacion/planificacion-prospecto/dto/planificacion-prospecto-json'
import { SolicitudEvaluacionRiesgoJson } from '@/aplicacion/solicitud-evaluacion-riesgo/dto/solicitud-evaluacion-riesgo-json'
import { UsuarioResumenJson } from '@/aplicacion/usuarios/dtos/usuario-resumen-json'

export interface ProspectoJson {
	id: number
	rut_riesgo?: string
	nombre_riesgo: string
	nombre_contacto: string
	telefono_contacto: string
	correo_contacto?: string
	direccion: string
	comuna: string
	observaciones?: string
	linea_negocio: string
	registrado_por: UsuarioResumenJson
	ejecutivo_comercial?: UsuarioResumenJson
	ejecutivo_evaluacion?: UsuarioResumenJson
	companies_sugeridas: string[]
	historial_estados: HistorialEstadoJson[]
	solicitud_evaluacion_riesgo?: SolicitudEvaluacionRiesgoJson
	evaluacion_riesgo?: EvaluacionRiesgoJson
	planificacion_prospecto?: PlanificacionProspectoJson
}
