import type { ObtenerReportesResponse } from '@/aplicacion/procesos-comerciales/dto/obtener-reportes-response'
import { obtenerReportesProcesosComerciales } from '@/aplicacion/procesos-comerciales/use-cases/obtener-reportes-procesos-comerciales'
import PanelProcesosComercialesClient from '@/components/paneles/procesos-comerciales/panel-procesos-comerciales-client'

export async function PanelInner() {
  const initialData: ObtenerReportesResponse =
    await obtenerReportesProcesosComerciales({ pagina: 1, tamano_pagina: 15, cerrado: false })
  return <PanelProcesosComercialesClient initialData={initialData} />
}
