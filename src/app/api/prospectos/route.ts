import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CrearProspectoRequest } from './dto/requests/crear-prospecto-request'

export async function GET() {
  try {
    const prospectos = await obtenerProspectos()
    return NextResponse.json(prospectos)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error obteniendo prospectos' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: CrearProspectoRequest = await request.json()
    const cookieStore = await cookies()

    await axiosClient.post('/prospectos', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error creando prospecto' },
      { status: 500 },
    )
  }
}
