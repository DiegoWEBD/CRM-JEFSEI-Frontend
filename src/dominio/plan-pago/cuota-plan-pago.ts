export default interface CuotaPlanPago {
	numero_cuota: number
	fecha_vencimiento: string
	pagado: boolean
	fecha_pago: string | null
}
