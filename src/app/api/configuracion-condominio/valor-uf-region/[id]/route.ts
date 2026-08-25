import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function DELETE(
	_: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const cookieStore = await cookies()
		const { id } = await params

		const response = await axiosClient.delete(`/configuracion-condominio/valor-uf-region/${id}`, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error:
						error.response?.data?.detail ||
						error.response?.data?.error ||
						error.message,
				},
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error eliminando valor UF por región' },
			{ status: 500 },
		)
	}
}
