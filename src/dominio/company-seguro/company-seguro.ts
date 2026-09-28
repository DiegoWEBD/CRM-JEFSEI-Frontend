import { FactorCuotasCompanyJson } from '@/aplicacion/companies-seguros/dto/factor-cuotas-company-json'

export default class CompanySeguro {
	constructor(
		public id: number,
		public nombre: string,
		public eliminado: boolean = false,
		public factores_cuotas: FactorCuotasCompanyJson[] = [],
	) {}
}
