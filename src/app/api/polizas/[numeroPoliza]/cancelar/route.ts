import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
	_request: Request,
	{ params }: { params: Promise<{ numeroPoliza: string }> },
) {
	try {
		const { numeroPoliza } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.post(
			`/polizas/${numeroPoliza}/cancelar`,
			{},
			{ headers: { Cookie: cookieStore.toString() } },
		)

		return NextResponse.json(response.data)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error cancelando póliza' },
			{ status: 500 },
		)
	}
}
