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
    const cookieStore = await cookies()

    const response = await axiosClient.post(
      `/procesos-comerciales/${id}/aceptacion`,
      undefined,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    return normalizarErrorServidor(error, 'Error registrando aceptacion del cliente')
  }
}
