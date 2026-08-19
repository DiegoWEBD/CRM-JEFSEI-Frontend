import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string; id_archivo: string }> },
) {
	try {
		const { id, id_archivo } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.get(
			`/prospectos/${id}/archivos/${id_archivo}`,
			{
				headers: { Cookie: cookieStore.toString() },
				responseType: 'arraybuffer',
			},
		)

		const contentType = String(
			response.headers['content-type'] || 'application/octet-stream',
		)
		const contentDisposition = String(
			response.headers['content-disposition'] || '',
		)
		const fileName =
			extractFileName(contentDisposition) || `archivo_${id_archivo}`

		return new NextResponse(response.data, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Content-Disposition':
					contentDisposition || `inline; filename="${fileName}"`,
			},
		})
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
			{ error: 'Error descargando archivo' },
			{ status: 500 },
		)
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string; id_archivo: string }> },
) {
	try {
		const { id, id_archivo } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.delete(
			`/prospectos/${id}/archivos/${id_archivo}`,
			{ headers: { Cookie: cookieStore.toString() } },
		)

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
			{ error: 'Error eliminando archivo' },
			{ status: 500 },
		)
	}
}

function extractFileName(contentDisposition: string): string | null {
	const match = contentDisposition.match(
		/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/,
	)
	return match ? decodeURIComponent(match[1]) : null
}
