import { cookies } from 'next/headers'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import Cotizacion from '@/dominio/cotizacion/cotizacion'
import { EstudioComercialCondominioResumen } from '@/aplicacion/estudio-comercial/use-cases/listar-estudios-comerciales/dto/estudio-comercial-condominio-resumen'
import { PanelEstudioFila } from '../../dto/panel-estudio-fila'

function calcularEstadoVencimiento(fechaStr: string | null): PanelEstudioFila['estado_vencimiento'] {
  if (!fechaStr) return null
  const hoy = new Date()
  const vencimiento = new Date(fechaStr)
  const diffMs = vencimiento.getTime() - hoy.getTime()
  const diffDias = diffMs / (1000 * 60 * 60 * 24)
  if (diffDias < 0) return 'vencida'
  if (diffDias <= 30) return 'por_vencer'
  return 'vigente'
}

export const obtenerPanelEstudios = async (): Promise<PanelEstudioFila[]> => {
  const cookieStore = await cookies()
  const cookie = cookieStore.toString()

  const solicitudesResponse = await axiosClient.get('/solicitudes-cotizacion', {
    headers: { Cookie: cookie },
  })
  const solicitudes: SolicitudCotizacionResumen[] = solicitudesResponse.data.solicitudes ?? solicitudesResponse.data

  const prospectoIds = [...new Set(solicitudes.map((s) => s.id_prospecto))]

  const estudiosPorProspecto = new Map<number, EstudioComercialCondominioResumen | null>()
  await Promise.all(
    prospectoIds.map(async (pid) => {
      try {
        const res = await axiosClient.get(`/estudio-comercial?prospecto_id=${pid}`, {
          headers: { Cookie: cookie },
        })
        const estudios: EstudioComercialCondominioResumen[] = res.data
        estudiosPorProspecto.set(pid, estudios.length > 0 ? estudios[0] : null)
      } catch {
        estudiosPorProspecto.set(pid, null)
      }
    }),
  )

  const solicitudesConCotizaciones = solicitudes.filter((s) => s.cantidad_cotizaciones > 0)
  const cotizacionesPorSolicitud = new Map<number, Cotizacion[]>()
  await Promise.all(
    solicitudesConCotizaciones.map(async (s) => {
      try {
        const res = await axiosClient.get(`/solicitudes-cotizacion/${s.id}/cotizaciones`, {
          headers: { Cookie: cookie },
        })
        cotizacionesPorSolicitud.set(s.id, res.data.cotizaciones ?? [])
      } catch {
        cotizacionesPorSolicitud.set(s.id, [])
      }
    }),
  )

  const filas: PanelEstudioFila[] = solicitudes.map((s) => {
    const cotizaciones = cotizacionesPorSolicitud.get(s.id) ?? []
    const fechasVencimiento = cotizaciones.map((c) => c.fecha_vencimiento).filter(Boolean)
    const vencimientoMasProximo = fechasVencimiento.length > 0
      ? fechasVencimiento.reduce((a, b) => (a < b ? a : b))
      : null

    const estudio = estudiosPorProspecto.get(s.id_prospecto) ?? null

    return {
      id: s.id,
      id_prospecto: s.id_prospecto,
      cliente: s.nombre_riesgo,
      linea_seguro: s.producto,
      ejecutivo_comercial: s.ejecutivo_comercial,
      prioridad: s.prioridad,
      cantidad_cotizaciones: s.cantidad_cotizaciones,
      fecha: s.fecha,
      vencimiento_mas_proximo: vencimientoMasProximo,
      estado_vencimiento: calcularEstadoVencimiento(vencimientoMasProximo),
      tiene_estudio: estudio !== null,
      id_estudio: estudio?.id ?? null,
    }
  })

  return filas
}
