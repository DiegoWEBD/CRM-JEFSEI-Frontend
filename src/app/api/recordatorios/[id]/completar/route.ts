import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type Props = {
	params: Promise<{ id: string }>
}

export async function PATCH(_request: Request, props: Props) {
	const { id } = await props.params
	try {
		const cookieStore = await cookies()

		const response = await axiosClient.patch(`/recordatorios/${id}/completar`, null, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
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
			{ error: 'Error completando recordatorio' },
			{ status: 500 },
		)
	}
}
