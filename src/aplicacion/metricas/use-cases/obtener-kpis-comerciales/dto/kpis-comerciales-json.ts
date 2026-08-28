export interface AgingRango {
  rango: string
  cantidad: number
  porcentaje: number
}

export interface KpisComercialesJson {
  conversion_prospectos: {
    total_prospectos: number
    prospectos_convertidos: number
    tasa_pct: number
  }
  cierre_oportunidades: {
    procesos_cerrados: number
    procesos_ganados: number
    procesos_perdidos: number
    tasa_pct: number
  }
  prima_vs_meta: {
    prima_neta_uf: number
    meta_uf: number
    cumplimiento_pct: number
  }
  tiempo_promedio_cierre: {
    promedio_dias: number
  }
  aging_pipeline: {
    total_abiertos: number
    rangos: AgingRango[]
  }
  renovacion: {
    polizas_vencidas: number
    polizas_renovadas: number
    tasa_pct: number
  }
  prima_en_riesgo: {
    polizas: number
    prima_uf: number
  }
  morosidad: {
    total_cuotas: number
    cuotas_morosas: number
    tasa_pct: number
  }
}
