import { obtenerUsuarioPorRut } from '@/aplicacion/usuarios/use-cases/obtener-usuario-por-rut'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ rut: string }> },
) {
	try {
		const { rut } = await params
		const cookieStore = await cookies()
		const usuario = await obtenerUsuarioPorRut(rut, cookieStore.toString())
		return NextResponse.json(usuario)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo usuario')
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ rut: string }> },
) {
	try {
		const { rut } = await params
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.put(`/usuarios/${rut}`, body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando usuario')
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ rut: string }> },
) {
	try {
		const { rut } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.delete(`/usuarios/${rut}`, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error eliminando usuario')
	}
}
