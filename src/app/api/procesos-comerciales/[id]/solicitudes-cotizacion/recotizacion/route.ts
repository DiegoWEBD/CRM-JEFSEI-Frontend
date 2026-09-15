import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.post(
      `/procesos-comerciales/${id}/solicitudes-cotizacion/recotizacion`,
      body,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    return normalizarErrorServidor(error, 'Error solicitando recotización')
  }
}
