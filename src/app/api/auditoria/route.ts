import { obtenerRegistrosAuditoria } from '@/aplicacion/auditoria/use-cases/obtener-registros-auditoria'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const resultado = await obtenerRegistrosAuditoria({
			textoBusqueda: searchParams.get('texto_busqueda'),
			categoria: searchParams.get('categoria'),
			evento: searchParams.get('evento'),
			rutUsuario: searchParams.get('rut_usuario'),
			ipOrigen: searchParams.get('ip_origen'),
			entidadTipo: searchParams.get('entidad_tipo'),
			fechaDesde: searchParams.get('fecha_desde'),
			fechaHasta: searchParams.get('fecha_hasta'),
			pagina: Number(searchParams.get('pagina')) || 1,
			tamanoPagina: Number(searchParams.get('tamano_pagina')) || 15,
		})
		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo registros de auditoría')
	}
}
