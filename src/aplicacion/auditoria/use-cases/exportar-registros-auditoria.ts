import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerRegistrosAuditoriaParams } from './obtener-registros-auditoria'

export const exportarRegistrosAuditoria = async (
	params?: ObtenerRegistrosAuditoriaParams,
): Promise<string> => {
	const cookieStore = await cookies()

	const searchParams = new URLSearchParams()
	if (params?.textoBusqueda) searchParams.set('texto_busqueda', params.textoBusqueda)
	if (params?.categoria) searchParams.set('categoria', params.categoria)
	if (params?.evento) searchParams.set('evento', params.evento)
	if (params?.rutUsuario) searchParams.set('rut_usuario', params.rutUsuario)
	if (params?.ipOrigen) searchParams.set('ip_origen', params.ipOrigen)
	if (params?.entidadTipo) searchParams.set('entidad_tipo', params.entidadTipo)
	if (params?.fechaDesde) searchParams.set('fecha_desde', params.fechaDesde)
	if (params?.fechaHasta) searchParams.set('fecha_hasta', params.fechaHasta)

	const queryString = searchParams.toString()
	const url = queryString ? `/auditoria/exportar?${queryString}` : '/auditoria/exportar'

	const response = await axiosClient.get(url, {
		headers: { Cookie: cookieStore.toString() },
		responseType: 'text',
	})

	return response.data as string
}
