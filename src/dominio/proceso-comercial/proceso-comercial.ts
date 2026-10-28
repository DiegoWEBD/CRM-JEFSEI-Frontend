import { EstadoInformativoJson } from '@/aplicacion/procesos-comerciales/dto/estado-informativo-json'

export interface ProcesoComercial {
	id: number
	ejecutivo_comercial: { rut: string; nombre: string } | null
	ejecutivo_evaluacion: { rut: string; nombre: string } | null
	id_prospecto: number
	nombre_cliente: string
	producto: string
	tipo_producto: string
	renovacion: boolean
	estado_actual: EstadoInformativoJson
	etapa_actual: { id: number; nombre: string }
	cerrado: boolean
	descartado: boolean
	fecha_estimada_cierre: string | null
	probabilidad_cierre_sistema: number
	probabilidad_cierre_ejecutivo: number | null
	prima_cotizada: number | null
	prima_potencial_estimada: number | null
	prima_esperada: number | null
}
