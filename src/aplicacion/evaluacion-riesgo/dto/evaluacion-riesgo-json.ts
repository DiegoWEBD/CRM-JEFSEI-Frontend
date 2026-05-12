import { UsuarioResumenJson } from '@/aplicacion/usuarios/dtos/usuario-resumen-json'

export interface EvaluacionRiesgoJson {
	id: number
	ej_comercial: UsuarioResumenJson
	observaciones?: string
	ej_evaluacion?: UsuarioResumenJson
}
