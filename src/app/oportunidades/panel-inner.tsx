import type { ReporteProcesoComercial } from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import { obtenerReportesProcesosComerciales } from '@/aplicacion/procesos-comerciales/use-cases/obtener-reportes-procesos-comerciales'
import PanelProcesosComercialesClient from '@/components/paneles/procesos-comerciales/panel-procesos-comerciales-client'

export async function PanelInner() {
  const initialData: ReporteProcesoComercial[] =
    await obtenerReportesProcesosComerciales({})
  return <PanelProcesosComercialesClient initialData={initialData} />
}
