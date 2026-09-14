import { obtenerProductos } from '@/aplicacion/producto/use-cases/obtener-productos'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const idLineaNegocio = searchParams.get('id_linea_negocio')
		const textoBusqueda = searchParams.get('texto_busqueda')
		const pagina = searchParams.get('pagina')
		const tamanoPagina = searchParams.get('tamano_pagina')

		const response = await obtenerProductos({
			idLineaNegocio: idLineaNegocio ? Number(idLineaNegocio) : undefined,
			textoBusqueda: textoBusqueda || undefined,
			pagina: pagina ? Number(pagina) : undefined,
			tamanoPagina: tamanoPagina ? Number(tamanoPagina) : undefined,
		})

		return NextResponse.json(response)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo productos')
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.post('/productos', body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data, { status: 201 })
	} catch (error) {
		return normalizarErrorServidor(error, 'Error registrando producto')
	}
}
