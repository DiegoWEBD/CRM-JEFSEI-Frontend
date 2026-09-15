import { AsignarEjecutivoComercialRequest } from '@/aplicacion/prospectos/use-cases/asignar-ejecutivo-comercial/dto/asignar-ejecutivo-comercial-request'
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
    const body: AsignarEjecutivoComercialRequest = await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.post(
      `/prospectos/${id}/asignar-ej-comercial`,
      body,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error asignando ejecutivo comercial')
  }
}
