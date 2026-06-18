import { format } from "date-fns"
import { es } from "date-fns/locale"

export type FilaConFechaSolicitud = {
  fechaSolicitudIso?: string
  fechaSolicitud: string
}

export function getFechaSolicitudIso(fila: FilaConFechaSolicitud): string {
  if (fila.fechaSolicitudIso) return fila.fechaSolicitudIso
  const soloDia = fila.fechaSolicitud.trim()
  if (soloDia.includes("T")) return soloDia
  return `${soloDia}T09:00:00.000Z`
}

export function fechaCalendarioDesdeIso(iso: string): string {
  return iso.slice(0, 10)
}

export function buildCamposFechaSolicitud(fechaHoraEnvioIso: string): {
  fechaSolicitud: string
  fechaSolicitudIso: string
} {
  const iso = new Date(fechaHoraEnvioIso).toISOString()
  return {
    fechaSolicitud: fechaCalendarioDesdeIso(iso),
    fechaSolicitudIso: iso,
  }
}

export type FechaSolicitudFormateada = {
  linea: string
  fecha: string
  hora: string
}

export function formatCreatedAtSolicitudCotizacionPerfil(iso?: string | null): string | null {
  if (!iso?.trim()) return null
  const raw = iso.trim()
  const d = new Date(raw.includes("T") ? raw : `${raw}T12:00:00`)
  if (Number.isNaN(d.getTime())) return null
  const fecha = format(d, "dd-MM-yyyy", { locale: es })
  const hora = format(d, "HH:mm", { locale: es })
  return `${fecha} · ${hora} h`
}

export function formatFechaSolicitudConHora(fila: FilaConFechaSolicitud): FechaSolicitudFormateada {
  const d = new Date(getFechaSolicitudIso(fila))
  const fecha = format(d, "d MMM yyyy", { locale: es })
  const hora = format(d, "HH:mm", { locale: es })
  return {
    linea: `${fecha}, ${hora} hrs`,
    fecha,
    hora: `${hora} hrs`,
  }
}
