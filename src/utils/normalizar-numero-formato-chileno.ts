export const normalizarNumeroFormatoChileno = (numero: number) =>
	new Intl.NumberFormat('es-CL').format(numero)
