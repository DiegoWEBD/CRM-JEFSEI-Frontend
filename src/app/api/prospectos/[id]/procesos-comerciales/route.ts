import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const { searchParams } = new URL(request.url)
    const abiertos = searchParams.get('abiertos')

    const queryParams = new URLSearchParams()
    if (abiertos !== null) {
      queryParams.set('abiertos', abiertos)
    }
    const queryString = queryParams.toString()

    const response = await axiosClient.get(
      `/prospectos/${id}/procesos-comerciales${queryString ? `?${queryString}` : ''}`,
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error obteniendo oportunidades comerciales' },
      { status: 500 },
    )
  }
}
