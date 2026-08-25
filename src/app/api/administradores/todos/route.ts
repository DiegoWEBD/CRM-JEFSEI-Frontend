import { obtenerAdministradores } from '@/aplicacion/administradores/use-cases/obtener-administradores/obtener-administradores'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const textoBusqueda = searchParams.get('texto_busqueda')

		const resultado = await obtenerAdministradores({
			textoBusqueda,
			pagina: 1,
			tamanoPagina: 9999,
		})

		return NextResponse.json(resultado.data)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error:
						error.response?.data?.error ||
						error.response?.data?.detail ||
						error.message,
				},
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo administradores' },
			{ status: 500 },
		)
	}
}
