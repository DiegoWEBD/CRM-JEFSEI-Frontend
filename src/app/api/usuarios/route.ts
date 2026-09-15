import { obtenerUsuarios } from '@/aplicacion/usuarios/use-cases/obtener-usuarios'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const resultado = await obtenerUsuarios({
			textoBusqueda: searchParams.get('texto_busqueda'),
			pagina: Number(searchParams.get('pagina')) || 1,
			tamanoPagina: Number(searchParams.get('tamano_pagina')) || 15,
		})
		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo usuarios')
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const cookiesModule = await import('next/headers')
		const cookieStore = await cookiesModule.cookies()

		const response = await axiosClient.post('/usuarios', body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data, { status: 201 })
	} catch (error) {
		return normalizarErrorServidor(error, 'Error registrando usuario')
	}
}
