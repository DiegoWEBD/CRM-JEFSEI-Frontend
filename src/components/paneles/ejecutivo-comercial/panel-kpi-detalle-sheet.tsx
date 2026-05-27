"use client"

import { KpiPanelDetalleKey } from "@/app/types/ejecutivo-comercial/panel/kpi-panel-detalle-key";
import Link from "next/link"


export type PanelKpiDetalleDatos =
  | { tipo: "clientes"; clientes: ClienteComercialPanelRow[]; destacarNuevos?: boolean }
  | { tipo: "solicitudes"; solicitudes: SolicitudEstudioRowMock[] }
  | { tipo: "estudios"; estudios: EstudioDisponiblePanelRow[] }

export function PanelKpiDetalleSheet({
  abierto,
  onOpenChange,
  kpiKey,
  datos,
}: {
  abierto: boolean
  onOpenChange: (open: boolean) => void
  kpiKey: KpiPanelDetalleKey | null
  datos: PanelKpiDetalleDatos | null
}) {
  const titulo = kpiKey ? KPI_PANEL_TITULOS[kpiKey] : ""

  return (
    <Sheet open={abierto} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <SheetTitle className="text-base">{titulo}</SheetTitle>
          <SheetDescription className="text-xs">
            Detalle del indicador · {EJECUTIVO_COMERCIAL_PANEL}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4 py-3">
          {!datos ? (
            <p className="text-xs text-muted-foreground">Sin datos.</p>
          ) : datos.tipo === "clientes" ? (
            <TablaClientes clientes={datos.clientes} destacarNuevos={datos.destacarNuevos} />
          ) : datos.tipo === "solicitudes" ? (
            <TablaSolicitudes solicitudes={datos.solicitudes} />
          ) : (
            <TablaEstudiosDisponibles estudios={datos.estudios} />
          )}
        </ScrollArea>

        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
          {kpiKey === "cotiz" ? (
            <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
              <Link href="/solicitudes-estudio">Ir a solicitudes de cotización</Link>
            </Button>
          ) : null}
          {kpiKey === "estDisp" ? (
            <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
              <Link href="/cotizaciones-estudios-emitidos">Ir a estudios emitidos</Link>
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function TablaClientes({
  clientes,
  destacarNuevos,
}: {
  clientes: ClienteComercialPanelRow[]
  destacarNuevos?: boolean
}) {
  if (clientes.length === 0) {
    return <p className="text-xs text-muted-foreground">Sin registros.</p>
  }
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-[10px] uppercase text-muted-foreground">Cliente</TableHead>
            <TableHead className="text-[10px] uppercase text-muted-foreground">Estado</TableHead>
            <TableHead className="text-right text-[10px] uppercase text-muted-foreground">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((c) => (
            <TableRow
              key={c.id}
              className={cn(
                "text-xs",
                destacarNuevos && c.asignacionPendienteRevision && "bg-amber-500/[0.08]",
              )}
            >
              <TableCell>
                <div className="font-medium text-foreground">{c.nombre}</div>
                <p className="text-[10px] text-muted-foreground">{c.tipoCliente}</p>
                {destacarNuevos && c.asignacionPendienteRevision ? (
                  <Badge variant="outline" className="mt-1 border-amber-500/40 text-[9px] text-amber-900">
                    Nuevo por revisar
                  </Badge>
                ) : null}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("text-[9px]", ESTADO_CLIENTE_COMERCIAL_BADGE[c.estadoComercial])}
                >
                  {ESTADO_CLIENTE_COMERCIAL_LABELS[c.estadoComercial]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
                  <EnlacePerfilEjecutivoComercial clienteId={c.id}>Ver</EnlacePerfilEjecutivoComercial>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TablaSolicitudes({ solicitudes }: { solicitudes: SolicitudEstudioRowMock[] }) {
  if (solicitudes.length === 0) {
    return <p className="text-xs text-muted-foreground">Sin cotizaciones solicitadas.</p>
  }
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-[10px] uppercase text-muted-foreground">Cliente</TableHead>
            <TableHead className="text-[10px] uppercase text-muted-foreground">Estado</TableHead>
            <TableHead className="text-right text-[10px] uppercase text-muted-foreground">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitudes.map((s) => {
            const label = etiquetaEstadoSolicitudComercial(s.estado)
            return (
              <TableRow key={s.id} className="text-xs">
                <TableCell>
                  <p className="font-medium">{s.cliente}</p>
                  <p className="text-[10px] text-muted-foreground">{s.lineaSeguro}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-[9px]", ESTADO_SOLICITUD_COMERCIAL_BADGE[label])}>
                    {label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
                    <Link href="/solicitudes-estudio">Ver</Link>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function TablaEstudiosDisponibles({ estudios }: { estudios: EstudioDisponiblePanelRow[] }) {
  if (estudios.length === 0) {
    return <p className="text-xs text-muted-foreground">Sin estudios disponibles.</p>
  }
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-[10px] uppercase text-muted-foreground">Cliente</TableHead>
            <TableHead className="text-[10px] uppercase text-muted-foreground">Estado</TableHead>
            <TableHead className="text-right text-[10px] uppercase text-muted-foreground">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estudios.map((e) => (
            <TableRow key={e.solicitudId} className="text-xs">
              <TableCell>
                <p className="font-medium">{e.clienteNombre}</p>
                <p className="text-[10px] text-muted-foreground">{e.lineaSeguro}</p>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("text-[9px]", ESTADO_ESTUDIO_PERFIL_BADGE.estudio_disponible)}
                >
                  {ESTADO_ESTUDIO_PERFIL_LABELS.estudio_disponible}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {e.clienteId ? (
                  <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
                    <EnlacePerfilEjecutivoComercial clienteId={e.clienteId}>
                      Ver perfil
                    </EnlacePerfilEjecutivoComercial>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
                    <Link href="/cotizaciones-estudios-emitidos">Ver</Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
