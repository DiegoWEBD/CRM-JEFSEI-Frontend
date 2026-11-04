import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const idProspecto = parseInt(id, 10)

    if (isNaN(idProspecto)) {
      return NextResponse.json(
        { error: 'ID de prospecto inválido' },
        { status: 400 },
      )
    }

    const body = await request.json()
    const codigoLineaNegocio = String(body?.codigo_linea_negocio ?? '')

    if (!['condominios', 'lineas_personales', 'lineas_comerciales'].includes(codigoLineaNegocio)) {
      return NextResponse.json(
        { error: 'Código de línea de negocio inválido' },
        { status: 400 },
      )
    }

    const cookieStore = await cookies()

    const response = await axiosClient.patch(
      `/prospectos/${idProspecto}/linea-negocio`,
      { codigo_linea_negocio: codigoLineaNegocio },
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error cambiando la línea de negocio del prospecto')
  }
}
