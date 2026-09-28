import CompanySeguro from '@/dominio/company-seguro/company-seguro'

export interface ObtenerCompaniesSegurosResponse {
	data: CompanySeguro[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
}
