import { PlanificacionProspectoJson } from '@/aplicacion/planificacion-prospecto/dto/planificacion-prospecto-json'
import { UsuarioResumenJson } from '@/aplicacion/usuarios/dtos/usuario-resumen-json'
import LineaNegocio from '../linea-negocio/linea-negocio'
import ProcesoComercial from '../proceso-comercial/proceso-comercial'

export interface Prospecto {
	id: number
	rut_riesgo?: string
	nombre_riesgo: string
	nombre_contacto: string
	telefono_contacto: string
	correo_contacto?: string
	direccion: string
	region: string
	comuna: string
	observaciones?: string
	linea_negocio: LineaNegocio
	registrado_por: UsuarioResumenJson
	companies_sugeridas: string[]
	proceso_comercial: ProcesoComercial
	planificacion_prospecto?: PlanificacionProspectoJson
	ultima_actualizacion: string
	informacion_completa: boolean
}
