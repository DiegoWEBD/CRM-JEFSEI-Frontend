import { MetricasDashboardGerenteJson } from './dto/metricas-dashboard-gerente-json'

export const obtenerMetricasDashboardGerente = async (): Promise<MetricasDashboardGerenteJson> => {
  return {
    produccion: {
      mes_actual: {
        total_prima_neta: 984.5,
        variacion_mes_anterior: 12.3,
        mes_label: 'Junio 2026',
      },
      tendencia_12_meses: [
        { mes: 'Jul', prima_neta: 720 },
        { mes: 'Ago', prima_neta: 780 },
        { mes: 'Sep', prima_neta: 810 },
        { mes: 'Oct', prima_neta: 765 },
        { mes: 'Nov', prima_neta: 830 },
        { mes: 'Dic', prima_neta: 920 },
        { mes: 'Ene', prima_neta: 710 },
        { mes: 'Feb', prima_neta: 740 },
        { mes: 'Mar', prima_neta: 860 },
        { mes: 'Abr', prima_neta: 895 },
        { mes: 'May', prima_neta: 876 },
        { mes: 'Jun', prima_neta: 984 },
      ],
      por_compania: [
        { nombre: 'Consorcio', valor: 320 },
        { nombre: 'BCI Seguros', valor: 245 },
        { nombre: 'Mapfre', valor: 180 },
        { nombre: 'Sura', valor: 140 },
        { nombre: 'Chilena', valor: 99 },
      ],
      por_ejecutivo: [
        { nombre: 'Diego Urrutia', valor: 284 },
        { nombre: 'María Pardo', valor: 215 },
        { nombre: 'Carlos Muñoz', valor: 178 },
        { nombre: 'Ana Soto', valor: 165 },
        { nombre: 'Pedro López', valor: 142 },
      ],
      por_ramo: [
        { nombre: 'Incendio', valor: 380 },
        { nombre: 'Terremoto', valor: 245 },
        { nombre: 'Daños por Agua', valor: 160 },
        { nombre: 'Equipos Eléctricos', valor: 110 },
        { nombre: 'Rotura', valor: 89 },
      ],
      compania_top: {
        nombre: 'Consorcio',
        prima_neta: 320,
      },
    },
    actividades_comerciales: {
      por_tipo: [
        { tipo: 'Llamada', concretadas: 45, pendientes: 12 },
        { tipo: 'Correo', concretadas: 38, pendientes: 15 },
        { tipo: 'Visita', concretadas: 22, pendientes: 8 },
        { tipo: 'Mensaje', concretadas: 30, pendientes: 10 },
        { tipo: 'Reunión', concretadas: 15, pendientes: 5 },
      ],
      resumen: {
        agendadas: 48,
        concretadas: 150,
        pendientes: 50,
        porcentaje_cumplimiento: 75,
      },
    },
    reportes_polizas: {
      por_comuna: [
        { nombre: 'Santiago', cantidad: 320 },
        { nombre: 'Providencia', cantidad: 215 },
        { nombre: 'Las Condes', cantidad: 180 },
        { nombre: 'Vitacura', cantidad: 145 },
        { nombre: 'Ñuñoa', cantidad: 98 },
        { nombre: 'Maipú', cantidad: 85 },
        { nombre: 'La Florida', cantidad: 72 },
        { nombre: 'Puente Alto', cantidad: 55 },
      ],
      por_sexo: [
        { nombre: 'Masculino', cantidad: 580 },
        { nombre: 'Femenino', cantidad: 420 },
        { nombre: 'Empresa', cantidad: 170 },
      ],
      por_rango_edad: [
        { nombre: '18-25', cantidad: 85 },
        { nombre: '26-35', cantidad: 240 },
        { nombre: '36-45', cantidad: 310 },
        { nombre: '46-55', cantidad: 280 },
        { nombre: '56-65', cantidad: 170 },
        { nombre: '66+', cantidad: 85 },
      ],
      por_ramo: [
        { nombre: 'Incendio', cantidad: 420 },
        { nombre: 'Terremoto', cantidad: 350 },
        { nombre: 'Daños por Agua', cantidad: 190 },
        { nombre: 'Equipos', cantidad: 120 },
        { nombre: 'Rotura', cantidad: 90 },
      ],
    },
    evaluacion_proyectos: {
      kpis: {
        total_proyectos: 24,
        monto_total_uf: 15600,
        tasa_conversion: 68,
      },
      por_compania: [
        { nombre: 'Consorcio', cantidad: 8 },
        { nombre: 'BCI Seguros', cantidad: 6 },
        { nombre: 'Mapfre', cantidad: 5 },
        { nombre: 'Sura', cantidad: 3 },
        { nombre: 'Chilena', cantidad: 2 },
      ],
      por_ramo: [
        { nombre: 'Incendio', cantidad: 10 },
        { nombre: 'Terremoto', cantidad: 6 },
        { nombre: 'Daños por Agua', cantidad: 4 },
        { nombre: 'Equipos', cantidad: 3 },
        { nombre: 'Rotura', cantidad: 1 },
      ],
    },
  }
}
