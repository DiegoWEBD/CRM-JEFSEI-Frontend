import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'

export type ActualizarRolesUsuarioRequest = {
	codigo_roles: string[]
}

export const actualizarRolesUsuario = async (
	rut: string,
	request: ActualizarRolesUsuarioRequest,
) => {
	const cookieStore = await cookies()

	const response = await axiosClient.put(
		`/usuarios/${rut}/roles`,
		request,
		{
			headers: { Cookie: cookieStore.toString() },
		},
	)

	return response.data
}
