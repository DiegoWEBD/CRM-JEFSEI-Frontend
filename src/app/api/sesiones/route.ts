import { obtenerSesiones } from '@/aplicacion/sesiones/use-cases/obtener-sesiones'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const resultado = await obtenerSesiones({
			textoBusqueda: searchParams.get('texto_busqueda'),
			rutUsuario: searchParams.get('rut_usuario'),
			estado: searchParams.get('estado'),
			pagina: Number(searchParams.get('pagina')) || 1,
			tamanoPagina: Number(searchParams.get('tamano_pagina')) || 15,
		})
		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo sesiones')
	}
}