// Tipos del importador de alícuotas (respuestas del backend y configuración).

export interface HojaExcel {
  nombre: string
  filas: number
  columnas: number
}

export interface CeldaVistaPrevia {
  valor: unknown
  formula_sin_resultado: boolean
}

export interface VistaPreviaExcel {
  fila_desde: number
  fila_hasta: number
  columna_desde: number
  columna_hasta: number
  celdas: CeldaVistaPrevia[][]
}

export interface SugerenciasEncabezados {
  fila_encabezados: number | null
  columna_identificador: number | null
  columna_prorrateo: number | null
  columnas_identificador_candidatas: number[]
  columnas_prorrateo_candidatas: number[]
}

export interface AnalizarAlicuotasResponse {
  hojas: HojaExcel[]
  hoja_seleccionada: string
  filas: number
  columnas: number
  vista_previa: VistaPreviaExcel
  sugerencias: SugerenciasEncabezados
}

export interface ConfiguracionImportacionAlicuotas {
  hoja: string
  fila_encabezados: number
  columna_identificador: number
  columna_prorrateo: number
  primera_fila: number
  ultima_fila: number
  interpretacion_prorrateo: string | null
}

export interface ProblemaAlicuota {
  fila_origen: number | null
  campo: string | null
  mensaje: string
  severidad: 'error' | 'advertencia'
}

export interface RegistroAlicuota {
  fila_origen: number
  identificador_unidad: string
  prorrateo_original: unknown
  prorrateo: number | null
  estado: 'valido' | 'error' | 'pendiente'
  problemas: ProblemaAlicuota[]
}

export interface InterpretacionProrrateo {
  tipo: string | null
  requiere_confirmacion: boolean
  motivo: string | null
}

export interface ValidarAlicuotasResponse {
  registros: RegistroAlicuota[]
  cantidad_registros: number
  problemas: ProblemaAlicuota[]
  tiene_errores_bloqueantes: boolean
  confirmacion_requerida: boolean
  suma_prorrateos: number | null
  interpretacion: InterpretacionProrrateo
  filas_excluidas: number[]
}

export interface UnidadAlicuotaRequest {
  identificador_unidad: string
  prorrateo: number
  fila_origen: number
}

export interface AlicuotaOportunidadResponse {
  nombre_excel: string | null
  unidades: UnidadAlicuotaRequest[]
  cantidad: number
}

export interface ImportacionAlicuotasResultado {
  nombreExcel: string
  unidades: UnidadAlicuotaRequest[]
  cantidadUnidades: number
  sumaProrrateos: number | null
  cantidadAdvertencias: number
  hoja: string
  filaEncabezados: number
  columnaIdentificador: number
  columnaProrrateo: number
  primeraFila: number
  ultimaFila: number
}
