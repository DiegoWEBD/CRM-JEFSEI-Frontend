import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
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
      `/polizas/${numeroPoliza}/registrar-renovacion-cotizada`,
      {},
      {
        headers: { Cookie: cookieStore.toString() },
      },
    )

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    return normalizarErrorServidor(error, 'Error registrando renovación cotizada')
  }
}
