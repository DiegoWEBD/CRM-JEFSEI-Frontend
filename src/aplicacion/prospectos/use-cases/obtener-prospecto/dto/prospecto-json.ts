import { HistorialEstadoJson } from '@/aplicacion/estados/dto/historial-estado-json'
import { EvaluacionRiesgoJson } from '@/aplicacion/evaluacion-riesgo/dto/evaluacion-riesgo-json'
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
	historial_estados: HistorialEstadoJson[]
	observaciones?: string
	linea_negocio: string
	registrado_por: UsuarioResumenJson
	companies_sugeridas: string[]
	evaluacion_riesgo?: EvaluacionRiesgoJson
}
