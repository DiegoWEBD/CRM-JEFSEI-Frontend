import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'

export const revocarTodasSesionesUsuario = async (
	rutUsuario: string,
): Promise<void> => {
	const cookieStore = await cookies()

	await axiosClient.patch(
		`/sesiones/usuario/${rutUsuario}/revocar-todas`,
		{},
		{ headers: { Cookie: cookieStore.toString() } },
	)
}