import CuotaPlanPago from './cuota-plan-pago'

export default interface PlanPago {
	id: number
	cuotas: CuotaPlanPago[]
}
