import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const formData = await request.formData()

    const response = await axiosClient.post('/importacion-alicuotas/validar', formData, {
      headers: { Cookie: cookieStore.toString() },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error validando las alícuotas')
  }
}
