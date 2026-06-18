import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { EstudioComercialCondominioResumen } from './dto/estudio-comercial-condominio-resumen'

export const listarEstudiosComerciales = async (
  prospectoId: number,
): Promise<EstudioComercialCondominioResumen[]> => {
  const cookieStore = await cookies()

  const response = await axiosClient.get(
    `/estudio-comercial?prospecto_id=${prospectoId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  )

  return response.data
}
