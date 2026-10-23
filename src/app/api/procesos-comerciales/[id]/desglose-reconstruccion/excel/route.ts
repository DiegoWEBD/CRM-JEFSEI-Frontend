import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const TIPO_CONTENIDO_XLSX =
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.get(
			`/procesos-comerciales/${id}/desglose-reconstruccion/excel`,
			{
				headers: {
					Cookie: cookieStore.toString(),
				},
				responseType: 'arraybuffer',
			},
		)

		const nombreArchivo = `desglose_reconstruccion_oportunidad_${id}.xlsx`

		return new NextResponse(response.data, {
			headers: {
				'Content-Type': TIPO_CONTENIDO_XLSX,
				'Content-Disposition': `attachment; filename="${nombreArchivo}"`,
			},
		})
	} catch (error) {
		return normalizarErrorServidor(error, 'Error descargando el desglose de reconstrucción')
	}
}
