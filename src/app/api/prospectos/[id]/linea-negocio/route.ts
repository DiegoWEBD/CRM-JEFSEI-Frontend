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
    const idLineaNegocio = Number(body?.id_linea_negocio)

    if (!Number.isInteger(idLineaNegocio) || idLineaNegocio <= 0) {
      return NextResponse.json(
        { error: 'ID de línea de negocio inválido' },
        { status: 400 },
      )
    }

    const cookieStore = await cookies()

    const response = await axiosClient.patch(
      `/prospectos/${idProspecto}/linea-negocio`,
      { id_linea_negocio: idLineaNegocio },
      { headers: { Cookie: cookieStore.toString() } },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error cambiando la línea de negocio del prospecto')
  }
}
