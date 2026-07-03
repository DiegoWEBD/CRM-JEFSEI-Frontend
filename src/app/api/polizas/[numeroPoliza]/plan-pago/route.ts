import { CrearPlanPagoRequest } from '@/aplicacion/polizas/use_cases/crear_plan_pago/dto/crear_plan_pago_request'
import { obtenerPlanPago } from '@/aplicacion/polizas/use_cases/obtener_plan_pago/obtener_plan_pago'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ numeroPoliza: string }> },
) {
	try {
		const { numeroPoliza } = await params
		const data = await obtenerPlanPago(numeroPoliza)
		return NextResponse.json(data)
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
			{ error: 'Error obteniendo plan de pago' },
			{ status: 500 },
		)
	}
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ numeroPoliza: string }> },
) {
	try {
		const { numeroPoliza } = await params
		const body: CrearPlanPagoRequest = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.post(
			`/polizas/${numeroPoliza}/plan-pago`,
			body,
			{ headers: { Cookie: cookieStore.toString() } },
		)

		return NextResponse.json(response.data, { status: 201 })
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
			{ error: 'Error creando plan de pago' },
			{ status: 500 },
		)
	}
}
