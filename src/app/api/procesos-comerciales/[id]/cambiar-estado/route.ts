import { CambiarEstadoManualRequest } from '@/aplicacion/procesos-comerciales/use-cases/cambiar-estado-manual/dto/cambiar-estado-manual-request'
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
    const body: CambiarEstadoManualRequest = await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.post(
      `/procesos-comerciales/${id}/cambiar-estado`,
      body,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error cambiando estado de la oportunidad')
  }
}
