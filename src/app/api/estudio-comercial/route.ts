import { listarEstudiosComerciales } from '@/aplicacion/estudio-comercial/use-cases/listar-estudios-comerciales/listar-estudios-comerciales'
import { ArmarEstudioComercialRequest } from '@/aplicacion/estudio-comercial/use-cases/armar-estudio-comercial/dto/armar-estudio-comercial-request'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const prospectoId = Number(request.nextUrl.searchParams.get('prospecto_id'))

    if (!prospectoId) {
      return NextResponse.json(
        { error: 'prospecto_id es requerido' },
        { status: 400 },
      )
    }

    const estudios = await listarEstudiosComerciales(prospectoId)
    return NextResponse.json(estudios)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error obteniendo estudios comerciales' },
      { status: 500 },
    )
  }
}

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
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error armando estudio comercial' },
      { status: 500 },
    )
  }
}
