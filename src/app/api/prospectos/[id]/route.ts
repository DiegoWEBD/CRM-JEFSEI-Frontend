import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const cookieStore = await cookies()
		const cookie = cookieStore.toString()
		const { id } = await params

		const response = await axiosClient.get(`/prospectos/${id}`, {
			headers: {
				Cookie: cookie,
			},
		})

		return NextResponse.json(response.data.prospecto)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}

		return NextResponse.json(
			{ error: 'Error obteniendo prospecto' },
			{ status: 500 },
		)
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const cookieStore = await cookies()
		const cookie = cookieStore.toString()
		const { id } = await params
		const body = await request.json()

		const response = await axiosClient.put(`/prospectos/${id}`, body, {
			headers: {
				Cookie: cookie,
			},
		})

		const data = response.data

		return NextResponse.json({ status: response.status, message: data.message })
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error:
						error.response?.data?.message ||
						error.response?.data?.error ||
						error.message,
				},
				{
					status: error.response?.status ?? 500,
				},
			)
		}

		return NextResponse.json(
			{ error: 'Error al actualizar la información del prospecto' },
			{ status: 500 },
		)
	}
}
