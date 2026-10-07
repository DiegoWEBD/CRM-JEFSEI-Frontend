import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'

export const revocarSesion = async (sesionId: string): Promise<void> => {
	const cookieStore = await cookies()

	await axiosClient.patch(
		`/sesiones/${sesionId}/revocar`,
		{},
		{ headers: { Cookie: cookieStore.toString() } },
	)
}