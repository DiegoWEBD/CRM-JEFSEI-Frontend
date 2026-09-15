import { AsignarEjecutivoEvaluacionRequest } from '@/aplicacion/prospectos/use-cases/asignar-ejecutivo-evaluacion/dto/asignar-ejecutivo-evaluacion-request'
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
    const body: AsignarEjecutivoEvaluacionRequest = await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.post(
      `/prospectos/${id}/asignar-ej-evaluacion`,
      body,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error asignando ejecutivo de evaluación')
  }
}
