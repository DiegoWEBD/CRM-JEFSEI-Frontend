'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import RegistroAuditoria from '@/dominio/registro-auditoria/registro-auditoria'
import { formatearFecha } from '@/utils/formatear-fecha'

type DialogDetalleRegistroProps = {
	registro: RegistroAuditoria | null
	cerrarDialog: () => void
}

type CampoDetalleProps = {
	etiqueta: string
	valor: string | number | null | undefined
}

function CampoDetalle({ etiqueta, valor }: CampoDetalleProps) {
	const vacio = valor === null || valor === undefined || valor === ''

	return (
		<div className='space-y-0.5'>
			<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
				{etiqueta}
			</p>
			<p className='text-sm text-foreground break-all'>
				{vacio ? '-' : String(valor)}
			</p>
		</div>
	)
}

export default function DialogDetalleRegistro({
	registro,
	cerrarDialog,
}: DialogDetalleRegistroProps) {
	if (!registro) return null

	const fecha = registro.fecha_registro
		? formatearFecha(new Date(registro.fecha_registro), 'dd/MM/yyyy HH:mm:ss')
		: '-'

	return (
		<Dialog open onOpenChange={cerrarDialog}>
			<DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Detalle del registro de auditoría</DialogTitle>
					<DialogDescription>
						Registro #{registro.id} - {fecha}
					</DialogDescription>
				</DialogHeader>

				<div className='flex flex-wrap gap-2'>
					<Badge
						variant={
							registro.categoria === 'AUTENTICACION'
								? 'pastel-blue'
								: 'pastel-violet'
						}
					>
						{registro.categoria === 'AUTENTICACION'
							? 'Conexión'
							: 'Acción de negocio'}
					</Badge>
					<Badge variant='secondary'>{registro.evento}</Badge>
					<Badge
						variant={registro.resultado === 'EXITO' ? 'success' : 'destructive'}
					>
						{registro.resultado === 'EXITO' ? 'Éxito' : 'Fallido'}
					</Badge>
				</div>

				{registro.detalle && (
					<div className='space-y-0.5 rounded-lg border border-border bg-muted/30 p-3'>
						<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
							{registro.categoria === 'ACCION_NEGOCIO' ? 'Acción' : 'Detalle'}
						</p>
						<p className='text-sm text-foreground'>{registro.detalle}</p>
					</div>
				)}

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<CampoDetalle etiqueta='Fecha' valor={fecha} />
					<CampoDetalle etiqueta='Usuario' valor={registro.nombre_usuario} />
					<CampoDetalle etiqueta='RUT usuario' valor={registro.rut_usuario} />
					<CampoDetalle etiqueta='IP origen' valor={registro.ip_origen} />
					<CampoDetalle etiqueta='Método' valor={registro.metodo} />
					<CampoDetalle etiqueta='Estado HTTP' valor={registro.estado_http} />
					<CampoDetalle etiqueta='Ruta' valor={registro.ruta} />
					<CampoDetalle etiqueta='Entidad' valor={registro.entidad_tipo} />
					<CampoDetalle etiqueta='ID entidad' valor={registro.entidad_id} />
					<CampoDetalle etiqueta='Duración (ms)' valor={registro.duracion_ms} />
					<CampoDetalle etiqueta='User agent' valor={registro.user_agent} />
					<div className='sm:col-span-2'>
						<CampoDetalle
							etiqueta='ID de petición (trazabilidad)'
							valor={registro.id_peticion}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant='outline' onClick={cerrarDialog}>
						Cerrar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
