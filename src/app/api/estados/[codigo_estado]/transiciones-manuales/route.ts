import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ codigo_estado: string }> },
) {
  try {
    const { codigo_estado } = await params
    const cookieStore = await cookies()

    const response = await axiosClient.get(
      `/estados/${encodeURIComponent(codigo_estado)}/transiciones-manuales`,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(
      error,
      'Error obteniendo transiciones manuales',
    )
  }
}
