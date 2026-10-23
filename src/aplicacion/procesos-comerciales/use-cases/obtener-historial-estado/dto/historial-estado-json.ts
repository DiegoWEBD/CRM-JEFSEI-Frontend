import { EstadoInformativoJson } from '@/aplicacion/procesos-comerciales/dto/estado-informativo-json'
import { UsuarioResumenJson } from '@/aplicacion/usuarios/dtos/usuario-resumen-json'

export interface HistorialEstadoJson {
  estado: EstadoInformativoJson
  fecha_registro: string
  observacion: string | null
  registrado_por: UsuarioResumenJson
  dias_transcurridos: number
}
