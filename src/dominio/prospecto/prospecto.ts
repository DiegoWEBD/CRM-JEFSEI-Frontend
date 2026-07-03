import { PlanificacionProspectoJson } from '@/aplicacion/planificacion-prospecto/dto/planificacion-prospecto-json'
import { UsuarioResumenJson } from '@/aplicacion/usuarios/dtos/usuario-resumen-json'
import LineaNegocio from '../linea-negocio/linea-negocio'

export interface Prospecto {
	id: number
	id_cliente?: number
	rut_riesgo?: string
	nombre_riesgo: string
	telefono_contacto?: string
	correo_contacto?: string
	direccion?: string
	region?: string
	comuna?: string
	observaciones?: string
	linea_negocio: LineaNegocio
	registrado_por: UsuarioResumenJson
	ejecutivo_comercial_asignado?: UsuarioResumenJson
	ejecutivo_evaluacion_asignado?: UsuarioResumenJson
	planificacion_prospecto?: PlanificacionProspectoJson
	ultima_actualizacion: string
	informacion_completa: boolean
}
