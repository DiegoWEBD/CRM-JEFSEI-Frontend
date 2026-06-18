import { Prioridad } from '@/types/prioridad/prioridad'

export default class SolicitudCotizacionResumen {
  constructor(
    public id: number,
    public id_prospecto: number,
    public nombre_riesgo: string,
    public informacion_completa: boolean,
    public ejecutivo_comercial: string,
    public tipo: string,
    public producto: string,
    public prioridad: Prioridad,
    public fecha: string,
    public cantidad_cotizaciones: number,
    public campos_faltantes: string[],
  ) {}
}
