import { obtenerNotificaciones } from '@/aplicacion/notificaciones/use-cases/obtener-notificaciones/obtener-notificaciones'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const noLeidas = searchParams.get('no_leidas')
		const nivel = searchParams.get('nivel')
		const codigoTipo = searchParams.get('codigo_tipo')
		const pagina = searchParams.get('pagina')
		const tamanoPagina = searchParams.get('tamano_pagina')

		const resultado = await obtenerNotificaciones({
			no_leidas: noLeidas === null ? undefined : noLeidas === 'true',
			nivel: (nivel as 'INFO' | 'AVISO' | 'CRITICO' | null) ?? undefined,
			codigo_tipo: codigoTipo ?? undefined,
			pagina: pagina ? Number(pagina) : 1,
			tamano_pagina: tamanoPagina ? Number(tamanoPagina) : 15,
		})

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo notificaciones')
	}
}
