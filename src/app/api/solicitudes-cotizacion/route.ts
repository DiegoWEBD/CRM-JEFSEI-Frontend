import { obtenerTodasSolicitudesCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-todas-solicitudes-cotizacion/obtener-todas-solicitudes-cotizacion'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const solicitudes = await obtenerTodasSolicitudesCotizacion()
    return NextResponse.json(solicitudes)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error obteniendo solicitudes' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()

    const response = await axiosClient.post('/solicitudes-cotizacion', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    })

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error al solicitar cotización' },
      { status: 500 },
    )
  }
}
