import { Prioridad } from '@/types/prioridad/prioridad'

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
  ) {}
}
