export interface CrearProspectoRequest {
  rut_riesgo: string | null
  id_administrador: number | null
  nombre_riesgo: string
  telefono_contacto: string | null
  correo_contacto: string | null
  direccion: string | null
  region: string | null
  comuna: string | null
  observaciones: string | null
  id_linea_negocio: number
  uf_por_metro_cuadrado: number | null
  porcentaje_depreciacion: number | null
  porcentaje_espacios_comunes: number | null
  tiene_locales_comerciales: boolean | null
  uso_del_condominio: string | null
  materialidad: string | null
  clasificacion_preliminar_incendio: string | null
  procesos_productivos: boolean | null
  numero_pisos: number | null
  numero_torres: number | null
  cantidad_departamentos: number | null
  cantidad_subterraneos: number | null
  tiene_piscina: boolean | null
  ubicacion_piscina: string | null
  tiene_alarma_incendio: boolean | null
  tiene_sprinklers: boolean | null
  year_construccion: number | null
  metros_cuadrados: number | null
}
