import { exportarRegistrosAuditoria } from '@/aplicacion/auditoria/use-cases/exportar-registros-auditoria'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const csv = await exportarRegistrosAuditoria({
			textoBusqueda: searchParams.get('texto_busqueda'),
			categoria: searchParams.get('categoria'),
			evento: searchParams.get('evento'),
			rutUsuario: searchParams.get('rut_usuario'),
			ipOrigen: searchParams.get('ip_origen'),
			entidadTipo: searchParams.get('entidad_tipo'),
			fechaDesde: searchParams.get('fecha_desde'),
			fechaHasta: searchParams.get('fecha_hasta'),
		})

		const nombreArchivo = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`

		return new NextResponse(csv, {
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': `attachment; filename="${nombreArchivo}"`,
			},
		})
	} catch (error) {
		return normalizarErrorServidor(error, 'Error exportando registros de auditoría')
	}
}
