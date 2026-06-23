import { CerrarProcesoComercialRequest } from '@/aplicacion/procesos-comerciales/use-cases/cerrar-proceso-comercial/dto/cerrar-proceso-comercial-request'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body: CerrarProcesoComercialRequest = await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.post(
      `/procesos-comerciales/${id}/cerrar`,
      body,
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
      { error: 'Error cerrando proceso comercial' },
      { status: 500 },
    )
  }
}
