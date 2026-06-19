import CompanySeguro from '@/dominio/company-seguro/company-seguro'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerCompaniesSegurosResponse } from '../dto/obtener-companies-seguros-response'
import { cookies } from 'next/headers'

export const obtenerCompaniesSeguros = async (): Promise<CompanySeguro[]> => {
	const cookieStore = await cookies()

	const axiosResponse = await axiosClient.get('/companies-seguros', {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})

	const response: ObtenerCompaniesSegurosResponse = axiosResponse.data
	return response.companies_seguros
}
