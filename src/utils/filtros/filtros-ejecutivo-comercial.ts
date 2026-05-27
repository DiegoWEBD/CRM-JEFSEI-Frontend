

export type KpiPanelDetalleKey = "activos" | "asignados" | "cotiz" | "estDisp"

export const KPI_PANEL_TITULOS: Record<KpiPanelDetalleKey, string> = {
  activos: "Clientes activos",
  asignados: "Clientes asignados",
  cotiz: "Cotizaciones solicitadas",
  estDisp: "Estudios disponibles",
}

export type EstudioDisponiblePanelRow = {
  solicitudId: string
  clienteId: string
  clienteNombre: string
  lineaSeguro: string
}

/** Clientes visibles para el ejecutivo del panel. */
export function clientesDelEjecutivoPanel(clientes: ClienteComercialPanelRow[]) {
  return clientes.filter(
    (c) => !c.ejecutivoAsignado || c.ejecutivoAsignado === EJECUTIVO_COMERCIAL_PANEL,
  )
}

export function filtrarClientesBusquedaPanel(
  clientes: ClienteComercialPanelRow[],
  texto: string,
): ClienteComercialPanelRow[] {
  const q = texto.trim().toLowerCase()
  if (!q) return clientes
  return clientes.filter((c) => {
    const blob = [
      c.nombre,
      c.tipoCliente,
      c.rut ?? "",
      c.telefono ?? "",
      c.correo ?? "",
      c.contacto ?? "",
      c.administrador ?? "",
      c.ejecutivoAsignado ?? "",
      ESTADO_CLIENTE_COMERCIAL_LABELS[c.estadoComercial],
    ]
      .join(" ")
      .toLowerCase()
    return blob.includes(q)
  })
}

/** Cliente con al menos una póliza registrada en sus líneas (mock + sesión). */
export function clienteTienePolizaRegistradaOVigente(
  lineas: LineaSeguroClienteMock[],
): boolean {
  return agregarPolizasDesdeLineas(lineas).length > 0
}

export function clientesActivosPanel(
  clientes: ClienteComercialPanelRow[],
  getLineasCliente: (clienteId: string) => LineaSeguroClienteMock[],
) {
  return clientes.filter((c) => clienteTienePolizaRegistradaOVigente(getLineasCliente(c.id)))
}

export function filtrarClientesPorEstadoComercial(
  clientes: ClienteComercialPanelRow[],
  estado: EstadoClienteComercialPanel | "todos",
): ClienteComercialPanelRow[] {
  if (estado === "todos") return clientes
  return clientes.filter((c) => c.estadoComercial === estado)
}

export type ConteosEstadoComercialPanel = {
  todos: number
  porEstado: Record<EstadoComercialCliente, number>
}

/** Conteos por estado comercial para chips del panel (reactivo al listado del ejecutivo). */
export function conteosEstadoComercialPanel(
  clientes: ClienteComercialPanelRow[],
): ConteosEstadoComercialPanel {
  const porEstado = Object.fromEntries(
    ESTADOS_COMERCIALES_CLIENTE.map((e) => [e, 0]),
  ) as Record<EstadoComercialCliente, number>
  for (const c of clientes) {
    const est = normalizarEstadoComercialCliente(c.estadoComercial)
    porEstado[est] += 1
  }
  return { todos: clientes.length, porEstado }
}

export function solicitudesCotizacionSolicitadasPanel(solicitudes: SolicitudEstudioRowMock[]) {
  return solicitudes
}

function registrosEstudiosEjecutivo(
  registros: readonly EstudioEmitidoRegistro[],
  clientes: ClienteComercialPanelRow[],
) {
  const idsClientes = new Set(clientes.map((c) => c.id))
  const nombresClientes = new Set(clientes.map((c) => c.nombre.trim().toLowerCase()))
  return registros.filter((r) => {
    if (r.ejecutivoComercial !== EJECUTIVO_COMERCIAL_PANEL) return false
    const cid = (r.clienteId ?? "").trim()
    if (cid && idsClientes.has(cid)) return true
    return nombresClientes.has(r.cliente.trim().toLowerCase())
  })
}

/** Estudios emitidos por Evaluación listos para gestión comercial (estado estudio_disponible). */
export function estudiosDisponiblesPanel(
  clientes: ClienteComercialPanelRow[],
  solicitudesEjecutivo: SolicitudEstudioRowMock[],
  getLineasCliente: (clienteId: string) => LineaSeguroClienteMock[],
  registros: readonly EstudioEmitidoRegistro[],
  solicitudTieneEstudioEmitido: (solicitudId: string) => boolean,
): EstudioDisponiblePanelRow[] {
  const out: EstudioDisponiblePanelRow[] = []
  const vistos = new Set<string>()

  const agregarSiDisponible = (
    solicitudId: string,
    clienteId: string | undefined,
    clienteNombre: string,
    lineaNombre: string,
  ) => {
    if (vistos.has(solicitudId) || !solicitudTieneEstudioEmitido(solicitudId)) return

    const cliente =
      (clienteId ? clientes.find((c) => c.id === clienteId) : undefined) ??
      clientes.find((c) => c.nombre === clienteNombre)

    const lineas = cliente ? getLineasCliente(cliente.id) : []
    const idsSolicitudesCliente = new Set(
      cliente
        ? registrosEstudiosEjecutivo(registros, [cliente])
            .filter((r) => (r.clienteId ?? "").trim() === cliente.id || r.cliente === cliente.nombre)
            .map((r) => r.solicitudId)
        : [],
    )
    idsSolicitudesCliente.add(solicitudId)

    const linea =
      lineas.find((l) => l.estudios.some((e) => e.id === solicitudId)) ??
      lineas.find((l) => l.nombre === lineaNombre) ??
      null

    const estadoEstudio = linea
      ? estadoEstudioPerfilDesdeLinea(linea, {
          solicitudTieneEstudioEmitido: (id) =>
            idsSolicitudesCliente.has(id) || solicitudTieneEstudioEmitido(id),
        })
      : "estudio_disponible"

    if (estadoEstudio !== "estudio_disponible") return

    vistos.add(solicitudId)
    out.push({
      solicitudId,
      clienteId: cliente?.id ?? clienteId ?? "",
      clienteNombre: cliente?.nombre ?? clienteNombre,
      lineaSeguro: linea?.nombre ?? lineaNombre,
    })
  }

  for (const solicitud of solicitudesEjecutivo) {
    agregarSiDisponible(solicitud.id, solicitud.clienteId, solicitud.cliente, solicitud.lineaSeguro)
  }

  for (const cliente of clientes) {
    const registrosCliente = registrosEstudiosEjecutivo(registros, [cliente]).filter(
      (r) => (r.clienteId ?? "").trim() === cliente.id || r.cliente === cliente.nombre,
    )
    for (const registro of registrosCliente) {
      agregarSiDisponible(registro.solicitudId, cliente.id, cliente.nombre, registro.lineaSeguro)
    }
  }

  return out.sort((a, b) => a.clienteNombre.localeCompare(b.clienteNombre, "es"))
}

export function calcularKpiEjecutivo(input: {
  clientes: ClienteComercialPanelRow[]
  solicitudesEjecutivo: SolicitudEstudioRowMock[]
  getLineasCliente: (clienteId: string) => LineaSeguroClienteMock[]
  registrosEstudiosEmitidos: readonly EstudioEmitidoRegistro[]
  solicitudTieneEstudioEmitido: (solicitudId: string) => boolean
  referenciaDiaIso: string
}) {
  const clientes = clientesDelEjecutivoPanel(input.clientes)
  const cotizacionesSolicitadas = solicitudesCotizacionSolicitadasPanel(input.solicitudesEjecutivo).length
  const estudiosDisponibles = estudiosDisponiblesPanel(
    clientes,
    input.solicitudesEjecutivo,
    input.getLineasCliente,
    input.registrosEstudiosEmitidos,
    input.solicitudTieneEstudioEmitido,
  ).length
  const clientesActivos = clientesActivosPanel(clientes, input.getLineasCliente).length

  return computeKpiPanelEjecutivo({
    clientes,
    cotizacionesSolicitadas,
    estudiosDisponibles,
    clientesActivos,
    referenciaDiaIso: input.referenciaDiaIso,
  })
}

export function datosDetalleKpi(
  key: KpiPanelDetalleKey,
  input: {
    clientes: ClienteComercialPanelRow[]
    solicitudesEjecutivo: SolicitudEstudioRowMock[]
    getLineasCliente: (clienteId: string) => LineaSeguroClienteMock[]
    registrosEstudiosEmitidos: readonly EstudioEmitidoRegistro[]
    solicitudTieneEstudioEmitido: (solicitudId: string) => boolean
    referenciaDiaIso: string
  },
) {
  const clientes = clientesDelEjecutivoPanel(input.clientes)
  switch (key) {
    case "activos":
      return {
        tipo: "clientes" as const,
        clientes: clientesActivosPanel(clientes, input.getLineasCliente),
      }
    case "asignados":
      return { tipo: "clientes" as const, clientes, destacarNuevos: true as const }
    case "cotiz":
      return {
        tipo: "solicitudes" as const,
        solicitudes: solicitudesCotizacionSolicitadasPanel(input.solicitudesEjecutivo),
      }
    case "estDisp":
      return {
        tipo: "estudios" as const,
        estudios: estudiosDisponiblesPanel(
          clientes,
          input.solicitudesEjecutivo,
          input.getLineasCliente,
          input.registrosEstudiosEmitidos,
          input.solicitudTieneEstudioEmitido,
        ),
      }
  }
}
