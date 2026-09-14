import { ArmarEstudioComercialRequest } from '@/aplicacion/estudio-comercial/use-cases/armar-estudio-comercial/dto/armar-estudio-comercial-request'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body: ArmarEstudioComercialRequest = await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.post('/estudio-comercial', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    })

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    return normalizarErrorServidor(error, 'Error armando estudio comercial')
  }
}
