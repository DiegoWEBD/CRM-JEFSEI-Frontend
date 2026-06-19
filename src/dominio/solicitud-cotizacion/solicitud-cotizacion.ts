import { Prioridad } from '@/types/prioridad/prioridad'

export interface ActividadAccidentesPersonales {
  actividad: string
  numero_asegurados: number
}

export default class SolicitudCotizacion {
  constructor(
    public id: number,
    public nombre_riesgo: string,
    public informacion_completa: boolean,
    public ejecutivo_comercial: string,
    public tipo: string,
    public producto: string,
    public prioridad: Prioridad,
    public fecha: string,
    public cantidad_cotizaciones: number,
    public observaciones?: string,
    public rut_ejecutivo_comercial?: string,
    public nombre_ejecutivo_comercial?: string,
    public recotizacion?: boolean,
    public motivo_recotizacion?: string | null,
    public numero_guardias?: number,
    public monto_asegurado_total?: number,
    public nombre_excel?: string,
    public actividades?: ActividadAccidentesPersonales[],
    public actividad_del_condominio?: string,
    public limite?: number,
  ) {}
}
