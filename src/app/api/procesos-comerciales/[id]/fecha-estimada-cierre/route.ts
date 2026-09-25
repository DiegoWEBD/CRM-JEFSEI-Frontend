import { ActualizarFechaEstimadaCierreRequest } from '@/aplicacion/procesos-comerciales/use-cases/actualizar-fecha-estimada-cierre/dto/actualizar-fecha-estimada-cierre-request'
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
    const body: ActualizarFechaEstimadaCierreRequest = await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.patch(
      `/procesos-comerciales/${id}/fecha-estimada-cierre`,
      body,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(
      error,
      'Error actualizando fecha estimada de cierre',
    )
  }
}
