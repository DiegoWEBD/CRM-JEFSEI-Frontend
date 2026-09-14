import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const { searchParams } = new URL(request.url)
    const idProspecto = searchParams.get('id_prospecto')

    const queryParams = new URLSearchParams()
    if (idProspecto !== null) {
      queryParams.set('id_prospecto', idProspecto)
    }
    const queryString = queryParams.toString()

    const response = await axiosClient.get(
      `/gestiones-comerciales${queryString ? `?${queryString}` : ''}`,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo gestiones comerciales')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.post('/gestiones-comerciales', body, {
      headers: { Cookie: cookieStore.toString() },
    })

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    return normalizarErrorServidor(error, 'Error registrando gestión comercial')
  }
}
