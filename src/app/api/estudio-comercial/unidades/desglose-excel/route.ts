import { GenerarDesgloseUnidadesRequest } from '@/aplicacion/estudio-comercial/use-cases/generar-desglose-unidades/dto/generar-desglose-unidades-request'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const TIPO_CONTENIDO_XLSX =
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export async function POST(request: Request) {
	try {
		const body: GenerarDesgloseUnidadesRequest = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.post(
			'/estudio-comercial/unidades/desglose-excel',
			body,
			{
				headers: {
					Cookie: cookieStore.toString(),
				},
				responseType: 'arraybuffer',
			},
		)

		const nombreArchivo = `desglose_unidades_solicitud_${body.id_solicitud}.xlsx`

		return new NextResponse(response.data, {
			headers: {
				'Content-Type': TIPO_CONTENIDO_XLSX,
				'Content-Disposition': `attachment; filename="${nombreArchivo}"`,
			},
		})
	} catch (error) {
		return normalizarErrorServidor(error, 'Error generando el desglose por unidad')
	}
}
