import { ActualizarProbabilidadCierreEjecutivoRequest } from '@/aplicacion/procesos-comerciales/use-cases/actualizar-probabilidad-cierre-ejecutivo/dto/actualizar-probabilidad-cierre-ejecutivo-request'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body: ActualizarProbabilidadCierreEjecutivoRequest =
      await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.patch(
      `/procesos-comerciales/${id}/probabilidad-cierre-ejecutivo`,
      body,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(
      error,
      'Error actualizando probabilidad de cierre del ejecutivo',
    )
  }
}
