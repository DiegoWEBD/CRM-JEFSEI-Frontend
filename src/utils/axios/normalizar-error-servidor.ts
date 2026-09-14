import axios from 'axios'
import { NextResponse } from 'next/server'

export const normalizarErrorServidor = (
	error: unknown,
	mensaje: string,
): NextResponse => {
	if (axios.isAxiosError(error)) {
		return NextResponse.json(
			{
				error:
					error.response?.data?.message ||
					error.response?.data?.error ||
					error.response?.data?.detail ||
					error.message,
			},
			{
				status: error.response?.status ?? 500,
			},
		)
	}

	return NextResponse.json({ error: mensaje }, { status: 500 })
}
