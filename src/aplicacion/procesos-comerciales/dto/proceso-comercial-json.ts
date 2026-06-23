import type { UsuarioResumenJson } from '@/aplicacion/usuarios/dtos/usuario-resumen-json'
import type { EstadoInformativoJson } from './estado-informativo-json'
import type { EtapaProcesoComercialJson } from './etapa-proceso-comercial-json'

export interface ProcesoComercialJson {
	id: number
	ejecutivo_comercial: UsuarioResumenJson | null
	ejecutivo_evaluacion: UsuarioResumenJson | null
	id_prospecto: number
	nombre_cliente: string
	producto: string
	estado_actual: EstadoInformativoJson
	etapa_actual: EtapaProcesoComercialJson
	cerrado: boolean
}
