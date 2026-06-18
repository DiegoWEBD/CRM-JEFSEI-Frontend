import { obtenerPanelEstudios } from '@/aplicacion/cotizaciones-estudios/use-cases/obtener-panel-estudios/obtener-panel-estudios'
import PanelCotizacionesEstudiosClient from '@/components/paneles/cotizaciones-estudios-emitidos/panel-cotizaciones-estudios-client'

export async function PanelInner() {
  const initialData = await obtenerPanelEstudios()
  return <PanelCotizacionesEstudiosClient initialData={initialData} />
}
