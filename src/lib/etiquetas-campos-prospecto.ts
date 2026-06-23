export const ETIQUETAS_CAMPOS_PROSPECTO: Record<string, string> = {
  rut_riesgo: 'Rut',
  telefono_contacto: 'Teléfono de contacto',
  correo_contacto: 'Correo de contacto',
  direccion: 'Dirección',
  region: 'Región',
  comuna: 'Comuna',
  observaciones: 'Observaciones',

  administrador: 'Administrador del condominio',
  uf_por_metro_cuadrado: 'UF por metro cuadrado',
  porcentaje_depreciacion: '% de depreciación',
  porcentaje_espacios_comunes: '% de espacios comunes',
  tiene_locales_comerciales: '¿Tiene locales comerciales?',
  uso_del_condominio: 'Uso del condominio',
  materialidad: 'Materialidad principal',
  clasificacion_preliminar_incendio: 'Clasificación preliminar incendio',
  procesos_productivos: '¿Tiene procesos productivos?',
  numero_pisos: 'N° de pisos',
  numero_torres: 'N° de torres',
  cantidad_departamentos: 'Cantidad de departamentos',
  cantidad_subterraneos: 'Cantidad de subterráneos',
  tiene_piscina: '¿Tiene piscina?',
  ubicacion_piscina: 'Ubicación de la piscina',
  tiene_alarma_incendio: '¿Tiene alarma de incendio?',
  tiene_sprinklers: '¿Tiene sprinklers?',
  year_construccion: 'Año de construcción',
  metros_cuadrados: 'Metros cuadrados',
}

export function labelCampo(key: string): string {
  return ETIQUETAS_CAMPOS_PROSPECTO[key] ?? key.replace(/_/g, ' ')
}
