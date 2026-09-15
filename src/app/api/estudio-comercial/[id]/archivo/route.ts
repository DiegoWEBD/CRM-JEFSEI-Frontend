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
    const formData = await request.formData()

    const response = await axiosClient.post(
      `/estudio-comercial/${id}/archivo`,
      formData,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error subiendo archivo de estudio comercial')
  }
}
