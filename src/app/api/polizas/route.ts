import { obtenerPolizas } from '@/aplicacion/polizas/use_cases/obtener_polizas/obtener_polizas'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const id_cliente = searchParams.get('id_cliente')
		const id_company = searchParams.get('id_company')
		const id_producto = searchParams.get('id_producto')
		const id_linea_negocio = searchParams.get('id_linea_negocio')
		const texto_busqueda = searchParams.get('texto_busqueda')
		const estado = searchParams.get('estado')
		const pagina = searchParams.get('pagina')
		const tamano_pagina = searchParams.get('tamano_pagina')

		const data = await obtenerPolizas({
			id_cliente: id_cliente ? Number(id_cliente) : undefined,
			id_company: id_company ? Number(id_company) : undefined,
			id_producto: id_producto ? Number(id_producto) : undefined,
			id_linea_negocio: id_linea_negocio ? Number(id_linea_negocio) : undefined,
			texto_busqueda: texto_busqueda || undefined,
			estado: estado || undefined,
			pagina: pagina ? Number(pagina) : undefined,
			tamano_pagina: tamano_pagina ? Number(tamano_pagina) : undefined,
		})

		return NextResponse.json(data)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo polizas' },
			{ status: 500 },
		)
	}
}
