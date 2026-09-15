import { obtenerCotizacionesPorSolicitud } from '@/aplicacion/cotizaciones/use-cases/obtener-cotizaciones-por-solicitud/obtener-cotizaciones-por-solicitud'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const cotizaciones = await obtenerCotizacionesPorSolicitud(
      Number(id),
      cookieStore.toString(),
    )
    return NextResponse.json(cotizaciones)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo cotizaciones')
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const cookieStore = await cookies()

    const response = await axiosClient.post(
      `/solicitudes-cotizacion/${id}/cotizaciones`,
      formData,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    )

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    return normalizarErrorServidor(error, 'Error registrando cotización')
  }
}
