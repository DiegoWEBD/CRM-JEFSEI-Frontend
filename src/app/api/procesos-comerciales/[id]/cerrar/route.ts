import { CerrarProcesoComercialRequest } from '@/aplicacion/procesos-comerciales/use-cases/cerrar-proceso-comercial/dto/cerrar-proceso-comercial-request'
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
    const body: CerrarProcesoComercialRequest = await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.post(
      `/procesos-comerciales/${id}/cerrar`,
      body,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error cerrando proceso comercial')
  }
}
