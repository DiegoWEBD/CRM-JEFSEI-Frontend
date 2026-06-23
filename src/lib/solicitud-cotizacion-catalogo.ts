export type TipoClienteSolicitudCotizacion = "persona_natural" | "condominio"

export type LineaSeguroSolicitudKey =
  | "vehiculos"
  | "hogar"
  | "vida"
  | "salud_complementario"
  | "mascotas"
  | "espacios_comunes"
  | "unidades"
  | "vida_guardia"
  | "accidentes_personales"
  | "rc_condominio"

export type CampoSolicitudCotizacionTipo = "text" | "number" | "actividades_aseguradas"

export interface CampoSolicitudCotizacionDef {
  key: string
  label: string
  tipo: CampoSolicitudCotizacionTipo
  placeholder?: string
  required?: boolean
}

export interface LineaSolicitudCotizacionDef {
  key: LineaSeguroSolicitudKey
  label: string
  campos: CampoSolicitudCotizacionDef[]
}

export const TIPO_CLIENTE_SOLICITUD_LABELS: Record<TipoClienteSolicitudCotizacion, string> = {
  persona_natural: "Persona natural",
  condominio: "Condominio",
}

export const PRIORIDAD_SOLICITUD_OPCIONES = ["normal", "alta"] as const

export type PrioridadSolicitud = (typeof PRIORIDAD_SOLICITUD_OPCIONES)[number]

export const PRIORIDAD_SOLICITUD_LABELS: Record<PrioridadSolicitud, string> = {
  normal: "Normal",
  alta: "Alta",
}

export const LINEAS_SOLICITUD_POR_TIPO: Record<
  TipoClienteSolicitudCotizacion,
  readonly LineaSolicitudCotizacionDef[]
> = {
  persona_natural: [
    { key: "vehiculos", label: "Seguro vehículos", campos: [] },
    { key: "hogar", label: "Seguro hogar", campos: [] },
    { key: "vida", label: "Seguro vida", campos: [] },
    { key: "salud_complementario", label: "Seguro salud / complementario", campos: [] },
    { key: "mascotas", label: "Seguro mascotas", campos: [] },
  ],
  condominio: [
    { key: "espacios_comunes", label: "Espacios comunes", campos: [] },
    {
      key: "unidades",
      label: "Unidades",
      campos: [
        {
          key: "monto_asegurado_total",
          label: "Monto asegurado total",
          tipo: "number",
          required: true,
        },
      ],
    },
    {
      key: "vida_guardia",
      label: "Vida guardia",
      campos: [
        {
          key: "numero_guardias",
          label: "Cantidad de guardias a asegurar",
          tipo: "number",
          required: true,
        },
      ],
    },
    {
      key: "accidentes_personales",
      label: "Accidentes personales",
      campos: [
        {
          key: "actividades_aseguradas",
          label: "Detalle de asegurados por actividad",
          tipo: "actividades_aseguradas",
          required: true,
        },
      ],
    },
    {
      key: "rc_condominio",
      label: "Responsabilidad civil",
      campos: [
        {
          key: "actividad_del_condominio",
          label: "Actividad del condominio",
          tipo: "text",
          required: true,
          placeholder: "Ej: administración de condominio, áreas comunes…",
        },
        {
          key: "limite",
          label: "Límite RC requerido",
          tipo: "number",
          required: true,
        },
      ],
    },
  ],
}

export const TIPO_LINEA_LABELS: Record<string, string> = {
  vehiculos: "Seguro vehículos",
  hogar: "Seguro hogar",
  vida: "Seguro vida",
  salud_complementario: "Seguro salud / complementario",
  mascotas: "Seguro mascotas",
  espacios_comunes: "Espacios comunes",
  unidades: "Unidades",
  vida_guardia: "Vida guardia",
  accidentes_personales: "Accidentes personales",
  rc_condominio: "Responsabilidad civil",
}

export function lineasSolicitudParaTipo(
  tipo: TipoClienteSolicitudCotizacion,
): readonly LineaSolicitudCotizacionDef[] {
  return LINEAS_SOLICITUD_POR_TIPO[tipo]
}

export function camposSolicitudParaLinea(
  tipo: TipoClienteSolicitudCotizacion,
  lineaKey: LineaSeguroSolicitudKey | "",
): CampoSolicitudCotizacionDef[] {
  if (!lineaKey) return []
  return LINEAS_SOLICITUD_POR_TIPO[tipo].find((l) => l.key === lineaKey)?.campos ?? []
}

export function lineaUsaActividadesAseguradas(
  tipo: TipoClienteSolicitudCotizacion,
  lineaKey: LineaSeguroSolicitudKey | "",
): boolean {
  if (!lineaKey) return false
  return camposSolicitudParaLinea(tipo, lineaKey).some((c) => c.tipo === "actividades_aseguradas")
}

export function inferirTipoClienteSolicitud(
  lineaNegocioNombre: string,
): TipoClienteSolicitudCotizacion {
  return lineaNegocioNombre.trim().toLowerCase() === "condominio" ? "condominio" : "persona_natural"
}
