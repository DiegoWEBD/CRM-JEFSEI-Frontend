import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'

export type AsignarPermisosRolRequest = {
	codigos_permiso: string[]
}

export const asignarPermisosRol = async (
	codigoRol: string,
	request: AsignarPermisosRolRequest,
) => {
	const cookieStore = await cookies()

	const response = await axiosClient.put(
		`/roles/${codigoRol}/permisos`,
		request,
		{
			headers: { Cookie: cookieStore.toString() },
		},
	)

	return response.data
}
